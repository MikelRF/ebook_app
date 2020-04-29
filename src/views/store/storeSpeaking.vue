<template>
  <div class="book-speaking">
    <!--顶部菜单-->
    <detail-title @back="back" ref="title"></detail-title>
    <!--滚动条-->
    <scroll class="content-wrapper"
            :top="42"
            :bottom="scrollBottom"
            :ifNoScroll="disableScroll"
            @onScroll="onScroll"
            ref="scroll">
      <!--书籍详情-->
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc"></book-info>
      <!--朗读栏-->
      <div class="book-speak-title-wrapper">
        <div class="icon-speak-wrapper">
          <span class="icon-speak"></span>
        </div>
        <div class="speak-title-wrapper">
          <span class="speak-title">语音朗读</span>
        </div>
        <div class="icon-down-wrapper" @click="toggleContent">
          <span :class="{'icon-down2': !ifShowContent, 'icon-up': ifShowContent}"></span>
        </div>
      </div>
      <!--目录-->
      <div class="book-detail-content-wrapper" v-show="ifShowContent">
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">加载中...</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <!--            点击弹出-->
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="speak(item, index)">
              <!--              播放动画标志-->
              <speak-playing v-if="playingIndex === index"
                             :number="4"
                             ref="speakPlaying"></speak-playing>
              <!--              目录名-->
              <div class="book-detail-content-navigation-text" :class="{'is-playing': playingIndex === index}"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio>
    </scroll>
    <bottom :chapter="chapter"
            :currentSectionIndex="currentSectionIndex"
            :currentSectionTotal="currentSectionTotal"
            :showPlay="showPlay"
            :isPlaying.sync="isPlaying"
            :playInfo="playInfo"
            @onPlayingCardClick="onPlayingCardClick"></bottom>
    <div class="book-wrapper">
      <div id="read"></div>
    </div>
    <speak-window :title="this.chapter ? this.chapter.label : ''"
                  :book="book"
                  :section="section"
                  :currentSectionIndex.sync="currentSectionIndex"
                  :currentSectionTotal="currentSectionTotal"
                  :isPlaying.sync="isPlaying"
                  :playInfo="playInfo"
                  @updateText="updateText"
                  ref="speakWindow"></speak-window>
  </div>
</template>

<script type="text/ecmascript-6">
  import DetailTitle from '../../components/detail/detailTitle'
  import BookInfo from '../../components/detail/bookInfo'
  import Scroll from '../../components/common/scroll'
  import SpeakPlaying from '../../components/speak/speakPlaying'
  import Bottom from '../../components/speak/speakBottom'
  import SpeakWindow from '../../components/speak/speakMask'
  import { backToUpLevel, findBook, getCategoryName } from '../../utils/store'
  import { download, flatList } from '../../api/store'
  import { getLocalForage } from '../../utils/localForage'
  import { realpx } from '../../utils/book'
  import Epub from 'epubjs'

  global.ePub = Epub
  const CryptoJS = require('crypto-js')
  const Base64 = require('js-base64').Base64
  const APPID = '5e858356'
  const API_SECRET = 'af591ec52c153f5dcae05e0fe90541aa'
  const API_KEY = '40b4a718897e0bfe6923712a68508481'
  const isChrome = navigator.userAgent.toLowerCase().match(/chrome/)
  const notSupportTip = isChrome ? '您的浏览器暂时不支持体验功能，请升级您的浏览器' : '您现在使用的浏览器暂时不支持体验功能，<br />推荐使用谷歌浏览器Chrome'

  function getWebsocketUrl () {
    return new Promise((resolve, reject) => {
      const apiKey = API_KEY
      const apiSecret = API_SECRET
      let url = 'wss://tts-api.xfyun.cn/v2/tts'
      const host = location.host
      const date = new Date().toGMTString()
      const algorithm = 'hmac-sha256'
      const headers = 'host date request-line'
      const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
      const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
      const signature = CryptoJS.enc.Base64.stringify(signatureSha)
      const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
      const authorization = btoa(authorizationOrigin)
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
      resolve(url)
    })
  }

  let audioCtx
  let source
  // const btnState = {
  //   unTTS: '立即合成',
  //   ttsing: '正在合成',
  //   endTTS: '立即播放',
  //   play: '停止播放',
  //   pause: '继续播放',
  //   endPlay: '重新播放',
  //   errorTTS: '合成失败'
  // }

  class Experience {
    constructor ({
      speed = 50,
      voice = 50,
      pitch = 50,
      text = '',
      engineType = 'aisound',
      voiceName = 'xiaoyan',
      playBtn = '.js-base-play',
      defaultText = ''
    } = {}) {
      this.speed = speed
      this.voice = voice
      this.pitch = pitch
      this.text = text
      this.defaultText = defaultText
      this.engineType = engineType
      this.voiceName = voiceName
      this.playBtn = playBtn
      this.playState = ''
      this.audioDatas = []
      this.pcmPlayWork = new Worker('/public/transform.worker')
      this.pcmPlayWork.onmessage = (e) => {
        this.onmessageWork(e)
      }
    }

    setConfig ({
      speed,
      voice,
      pitch,
      text,
      defaultText,
      engineType,
      voiceName
    }) {
      speed && (this.speed = speed)
      voice && (this.voice = voice)
      pitch && (this.pitch = pitch)
      text && (this.text = text)
      defaultText && (this.defaultText = defaultText)
      engineType && (this.engineType = engineType)
      voiceName && (this.voiceName = voiceName)
      this.resetAudio()
    }

    onmessageWork (e) {
      switch (e.data.command) {
        case 'newAudioData': {
          this.audioDatas.push(e.data.data)
          if (this.playState === 'ttsing' && this.audioDatas.length === 1) {
            this.playTimeout = setTimeout(() => {
              this.audioPlay()
            }, 1000)
          }
          break
        }
      }
    }

    setBtnState (state) {
      // const oldState = this.playState
      this.playState = state
    }

    getAudio () {
      this.setBtnState('ttsing')
      getWebsocketUrl().then((url) => {
        this.connectWebsocket(url)
      })
    }

    connectWebsocket (url) {
      console.log('url', url)
      if ('WebSocket' in window) {
        this.websocket = new WebSocket(url)
      } else if ('MozWebSocket' in window) {
        this.websocket = new WebSocket(url)
      } else {
        alert(notSupportTip)
        return
      }
      const self = this
      console.log('self', self)
      this.websocket.onopen = (e) => {
        console.log('websocket.onopen', e)
        const params = {
          common: {
            app_id: APPID // APPID
          },
          business: {
            ent: self.engineType,
            aue: 'raw',
            auf: 'audio/L16;rate=16000',
            vcn: self.voiceName,
            speed: self.speed,
            volume: self.voice * 10,
            pitch: self.pitch,
            tte: 'UTF8'
          },
          data: {
            status: 2,
            text: Base64.encode(self.text || self.defaultText)
          }
        }
        this.websocket.send(JSON.stringify(params))
      }
      this.websocket.onmessage = (e) => {
        const jsonData = JSON.parse(e.data)
        console.log('websocket.onmessage', jsonData)
        // 合成失败
        if (jsonData.code !== 0) {
          alert(`${jsonData.code}:${jsonData.message}`)
          self.resetAudio()
          this.websocket.close()
          return
        }
        self.pcmPlayWork.postMessage({
          command: 'transData',
          data: jsonData.data.audio
        })

        if (jsonData.code === 0 && jsonData.data.status === 2) {
          this.websocket.close()
        }
      }
      this.websocket.onerror = (e) => {
        console.log('err', e)
        console.log(e.data)
      }
      this.websocket.onclose = (e) => {
        console.log('onclose', e)
      }
    }

    resetAudio () {
      this.audioPause()
      this.setBtnState('unTTS')
      this.audioDatasIndex = 0
      this.audioDatas = []
      this.websocket && this.websocket.close()
      clearTimeout(this.playTimeout)
    }

    audioPlay () {
      try {
        if (!audioCtx) {
          console.log('1  audioCtx')
          audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        }
        if (!audioCtx) {
          console.log('2  audioCtx')
          alert(notSupportTip)
          return
        }
      } catch (e) {
        console.log('3  audioCtx')
        alert(notSupportTip)
        return
      }
      this.audioDatasIndex = 0
      if (this.audioDatas.length) {
        console.log('playSource')
        this.playSource()
        this.setBtnState('play')
      } else {
        console.log('getAudio')
        this.getAudio()
      }
    }

    audioPause (state) {
      if (this.playState === 'play') {
        this.setBtnState(state || 'endPlay')
      }
      clearTimeout(this.playTimeout)
      try {
        source && source.stop()
      } catch (e) {
        console.log('err', e)
      }
    }

    playSource () {
      let bufferLength = 0
      const dataLength = this.audioDatas.length
      for (let i = this.audioDatasIndex; i < dataLength; i++) {
        bufferLength += this.audioDatas[i].length
      }
      const audioBuffer = audioCtx.createBuffer(1, bufferLength, 22050)
      let offset = 0
      const nowBuffering = audioBuffer.getChannelData(0)
      for (let i = this.audioDatasIndex; i < dataLength; i++) {
        const audioData = this.audioDatas[i]
        if (audioBuffer.copyToChannel) {
          audioBuffer.copyToChannel(audioData, 0, offset)
        } else {
          for (let j = 0; j < audioData.length; j++) {
            nowBuffering[offset + j] = audioData[j]
          }
        }
        offset += audioData.length
        this.audioDatasIndex++
      }

      source = audioCtx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioCtx.destination)
      source.start()
      source.onended = (event) => {
        if (this.playState !== 'play') {
          return
        }
        if (this.audioDatasIndex < this.audioDatas.length) {
          this.playSource()
        } else {
          this.audioPause('endPlay')
        }
      }
    }
  }

  const experience = new Experience({
    speed: 50,
    voice: 50,
    pitch: 50,
    playBtn: '.audio-ctrl-btn'
  })
  export default {
    components: {
      DetailTitle,
      BookInfo,
      Scroll,
      SpeakPlaying,
      Bottom,
      SpeakWindow
    },
    computed: {
      // 音频当前播放的分钟数
      currentMinute () {
        const m = Math.floor(this.currentPlayingTime / 60)
        return m < 10 ? '0' + m : m
      },
      // 音频当前播放的秒数
      currentSecond () {
        const s = Math.floor(this.currentPlayingTime - parseInt(this.currentMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      // 音频的总时长
      totalMinute () {
        const m = Math.floor(this.totalPlayingTime / 60)
        return m < 10 ? '0' + m : m
      },
      // 音频的总秒数
      totalSecond () {
        const s = Math.floor(this.totalPlayingTime - parseInt(this.totalMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      // 音频的剩余分钟数
      leftMinute () {
        const m = Math.floor((this.totalPlayingTime - this.currentPlayingTime) / 60)
        return m < 10 ? '0' + m : m
      },
      // 音频的剩余秒数
      leftSecond () {
        const s = Math.floor((this.totalPlayingTime - this.currentPlayingTime) - parseInt(this.leftMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      // 播放信息对象
      playInfo () {
        if (this.audioCanPlay) {
          return {
            currentMinute: this.currentMinute,
            currentSecond: this.currentSecond,
            totalMinute: this.totalMinute,
            totalSecond: this.totalSecond,
            leftMinute: this.leftMinute,
            leftSecond: this.leftSecond
          }
        } else {
          return null
        }
      },
      // 电子书的语种
      lang () {
        return this.metadata ? this.metadata.language : ''
      },
      // 当播放面板显示时，禁用滚动条（解决事件穿透问题）
      disableScroll () {
        if (this.$refs.speakWindow) {
          return this.$refs.speakWindow.visible
        } else {
          return false
        }
      },
      // 是否底部的播放面板
      showPlay () {
        return this.playingIndex >= 0
      },
      // 滚动条距底部距离，当显示播放面板时为116像素，不显示时为52像素
      scrollBottom () {
        return this.showPlay ? 52 : 0
      },
      // 当前章节信息
      chapter () {
        return this.flatNavigation[this.playingIndex]
      },
      // 电子书摘要信息
      desc () {
        if (this.description) {
          return this.description.substring(0, 100)
        } else {
          return ''
        }
      },
      // 一维数组的目录
      flatNavigation () {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
        } else {
          return []
        }
      },
      // 电子书分类
      category () {
        return this.bookItem ? getCategoryName(this.bookItem.category) : ''
      },
      // 电子书书名
      title () {
        return this.metadata ? this.metadata.title : ''
      },
      // 电子书作者
      author () {
        return this.metadata ? this.metadata.creator : ''
      }
    },
    data () {
      return {
        bookItem: null,
        book: null,
        rendition: null,
        metadata: null,
        cover: null,
        navigation: null,
        description: null,
        ifShowContent: true,
        playingIndex: -1,
        paragraph: null,
        currentSectionIndex: null,
        currentSectionTotal: null,
        section: null,
        isPlaying: false,
        audio: null,
        audioCanPlay: false,
        currentPlayingTime: 0,
        totalPlayingTime: 0,
        playStatus: 0, // 0 - 未播放，1 - 播放中，2 - 暂停中
        toastText: '',
        isOnline: false
      }
    },
    methods: {
      createVoice (text) {
        console.log('在线语音合成', text)
        if (text !== experience.text) {
          experience.setConfig({
            text
          })
        }
        console.log('experience', experience)
        if (experience.playState === 'play') {
          experience.audioPause()
          this.resetPlay()
        } else {
          console.log('play')
          experience.audioPlay()
          this.isPlaying = true
          this.playStatus = 1
        }
        // const xmlhttp = new XMLHttpRequest()
        // xmlhttp.open('GET', `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}&lang=${this.lang.toLowerCase()}`, false)
        // xmlhttp.send()
        // const xmlDoc = xmlhttp.responseText
        // if (xmlDoc) {
        //   const json = JSON.parse(xmlDoc)
        //   if (json.path) {
        //     this.$refs.audio.src = json.path
        //     this.continuePlay()
        //   } else {
        //     this.simpleToast('播放失败，未生成链接')
        //   }
        // } else {
        //   this.simpleToast('播放失败')
        // }
        /*
        axios.create({
          baseURL: process.env.VUE_APP_VOICE_URL + '/voice'
        })({
          method: 'get',
          params: {
            text: text,
            lang: this.lang.toLowerCase()
          }
        }).then(response => {
          if (response.status === 200) {
            if (response.data.error === 0) {
              const downloadUrl = response.data.path
              console.log('开始下载...%s', downloadUrl)
              downloadMp3(downloadUrl, blob => {
                const url = window.URL.createObjectURL(blob)
                console.log(blob, url)
                this.$refs.audio.src = url
                this.continuePlay()
              })
            } else {
              this.showToast(response.data.msg)
            }
          } else {
            this.showToast('请求失败')
          }
        }).catch(err => {
          console.log(err)
          this.showToast('播放失败')
        })
        */
      },
      togglePlay () {
        if (!this.isPlaying) {
          if (this.playStatus === 0) {
            this.play()
          } else if (this.playStatus === 2) {
            this.continuePlay()
          }
        } else {
          this.pausePlay()
        }
      },
      speak (item, index) {
        this.resetPlay()
        this.playingIndex = index
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
        if (this.chapter) { // 当前章节存在
          // 获取当前章节内容
          this.section = this.book.spine.get(this.chapter.href)
          this.rendition.display(this.section.href).then(section => {
            const currentPage = this.rendition.currentLocation()
            // console.log('currentPage', currentPage)
            const cfibase = section.cfiBase
            const cfistart = currentPage.start.cfi.replace(/.*!/, '').replace(/\)/, '')
            const cfiend = currentPage.end.cfi.replace(/.*!/, '').replace(/\)/, '')
            this.currentSectionIndex = currentPage.start.displayed.page
            this.currentSectionTotal = currentPage.start.displayed.total
            const cfi = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
            // console.log(currentPage, cfi, cfibase, cfistart, cfiend)
            // 获取文本
            this.book.getRange(cfi).then(range => {
              let text = range.toLocaleString()
              text = text.replace(/\s(2,)/g, '')
              text = text.replace(/\r/g, '')
              text = text.replace(/\n/g, '')
              text = text.replace(/\t/g, '')
              text = text.replace(/\f/g, '')
              this.updateText(text)
            })
          })
        }
      },
      // 重置播放状态
      resetPlay () {
        if (this.playStatus === 1) {
          this.pausePlay()
        }
        this.isPlaying = false
        this.playStatus = 0
      },
      play () {
        this.createVoice(this.paragraph)
      },
      continuePlay () {
        this.$refs.audio.play().then(() => {
          this.$refs.speakPlaying[0].startAnimation()
          this.isPlaying = true
          this.playStatus = 1
        })
      },
      pausePlay () {
        this.$refs.audio.pause() // 暂停
        this.$refs.speakPlaying[0].stopAnimation() // 暂停动画
        this.isPlaying = false
        this.playStatus = 2
      },
      onAudioEnded () {
        this.resetPlay()
        this.currentPlayingTime = this.$refs.audio.currentTime
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        this.$refs.speakWindow.refreshProgress(percent)
        this.$refs.speakWindow.next()
      },
      onTimeUpdate () {
        this.currentPlayingTime = this.$refs.audio.currentTime
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        this.$refs.speakWindow.refreshProgress(percent)
      },
      onCanPlay () {
        this.audioCanPlay = true
        this.currentPlayingTime = this.$refs.audio.currentTime
        this.totalPlayingTime = this.$refs.audio.duration
      },
      findBookFromList (fileName) {
        flatList().then(response => {
          if (response.status === 200) {
            const bookList = response.data.data.filter(item => item.fileName === fileName)
            if (bookList && bookList.length > 0) {
              this.bookItem = bookList[0]
              this.init()
            }
          }
        })
      },
      init () {
        const fileName = this.$route.query.fileName
        if (!this.bookItem) {
          this.bookItem = findBook(fileName)
        }
        if (this.bookItem) {
          getLocalForage(`${sessionStorage.getItem('userName')} / ${fileName}}`
            , (err, blob) => {
              if (err || !blob) {
                // this.downloadBook(fileName)
                this.isOnline = true
                const opf = this.$route.query.opf
                if (opf) {
                  this.parseBook(opf)
                }
              } else {
                this.isOnline = false
                this.parseBook(blob)
              }
            })
        } else {
          this.findBookFromList(fileName)
        }
      },
      downloadBook (fileName) {
        download(
          this.bookItem,
          () => {
            getLocalForage(`${sessionStorage.getItem('userName')} / ${fileName}}`
              , (err, blob) => {
                if (err) {
                  return
                }
                this.parseBook(blob)
              })
          })
      },
      parseBook (blob) {
        this.book = new Epub(blob)
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
        })
        if (this.isOnline) {
          this.book.coverUrl().then(url => {
            this.cover = url
          })
        } else {
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.cover = url
            })
          })
        }
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav
        })
        this.display()
      },
      back () {
        backToUpLevel(this)
      },
      onScroll (offsetY) {
        if (offsetY > realpx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      toggleContent () {
        this.ifShowContent = !this.ifShowContent
      },
      display () {
        const height = window.innerHeight * 0.9 - realpx(30) - realpx(46) - realpx(48) - realpx(60) - realpx(44)
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: height,
          method: 'default'
        })
        this.rendition.display()
      },
      doFlatNavigation (content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },
      showToast (text) {
        this.simpleToast(text)
      },
      onPlayingCardClick () {
        this.$refs.speakWindow.show()
      },
      // 获取文本
      updateText (text) {
        this.paragraph = text
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-speaking {
    font-size: px2rem(16);
    width: 100%;
    background: white;

    .content-wrapper {
      width: 100%;

      .book-speak-title-wrapper {
        display: flex;
        padding: px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;

        .icon-speak-wrapper {
          flex: 0 0 px2rem(40);
          @include left;

          .icon-speak {
            font-size: px2rem(24);
            color: #999;
          }
        }

        .speak-title-wrapper {
          flex: 1;
          @include left;

          .speak-title {
            font-size: px2rem(16);
            font-weight: bold;
            color: #666;
          }
        }

        .icon-down-wrapper {
          flex: 0 0 px2rem(40);
          @include right;

          .icon-up {
            font-size: px2rem(12);
            color: #999;
          }

          .icon-down2 {
            font-size: px2rem(12);
            color: #999;
          }
        }
      }

      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;

        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);

          .loading-text-wrapper {
            width: 100%;

            .loading-text {
              font-size: px2rem(14);
              color: #999;
            }
          }

          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              display: flex;
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #333;
              border-bottom: px2rem(1) solid #eee;

              &:last-child {
                border-bottom: none;
              }

              .book-detail-content-navigation-text {
                flex: 1;
                width: 100%;
                @include ellipsis;

                &.is-playing {
                  color: $color-blue;
                  font-weight: bold;
                  margin-left: px2rem(10);
                }
              }
            }
          }
        }
      }
    }

    .book-wrapper {
      position: absolute;
      bottom: -100%;
      z-index: 100;
    }
  }
</style>

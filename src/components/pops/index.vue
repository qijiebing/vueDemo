<template>
    <div id="pop" v-if='pop'>
        <div class="layer" v-if='params.type=="confirm" || params.type=="alert"' :class="layerShow?'show':''" @click='closePop'>
            <section class="confirm-box" :class="classShow?'show':''">
                <h2 class="title border-bottom c" v-if="params.type=='confirm'">{{params.title}}</h2>
                <article v-html="params.txt" class="c content"></article>
                <div class="flex-box border-top">
                    <p class="flex1 c btn" v-if="params.type=='confirm'" @click="btn(false)">{{params.cancelBtn}}</p>
                    <p class="flex1 c btn" @click="btn(true)">{{params.okBtn}}</p>
                </div>
            </section>
        </div>
        <div class="tclayer-loading" v-if="params.type == 'loading'">
            <div class="tclayer-loading-icon">
                <div class="tclayer-loading-pic"></div>
            </div>
            <p class="tclayer-loading-text">{{params.txt}}</p>
        </div>
        <div :style="params.style" class="toast" v-if='params.type=="toast"'>
            <p v-html='params.txt'></p>
        </div>
        <div v-if='params.type=="desc"' class="desc" :class="layerShow?'show':''">
            <div class="title  c" v-if=" params.title">
                <p v-html="params.title"></p><span @click="cancel" class="close ifont light-gray f14">&#xe91c;</span>
            </div>
            <div v-html="params.txt" class="content"></div>
            <div class="flex-box border-top" v-if='params.okBtn'>
                <p class="flex1 c btn f18 bold" @click="btn(true)">{{params.okBtn}}</p>
            </div>
        </div>
        <div class="layer" v-if='(params.type=="loading" || params.type=="desc") && params.modal' :class="layerShow ?'show':''"></div>
    </div>
</template>
<script>
let timer = null
export default {
    name: 'pops',
    props: ['con', 'type'],

    data() {
        return {
            params: {},
            layerShow: false,
            classShow: false,
            pop: false,
            showShake: false,
            showBigimg: true
            // closePopState: store.state.closePopState
        }
    },
    methods: {
        // ...mapMutations(['setData']),
        cancel() {
            this.params.show = false
            this.params.cancelFn()
        },
        ok() {
            this.params.show = false
            this.params.okFn()
        },
        btn(type) {
            this.params.show = false
            // return new Promise((resolve, reject) => {
            if (type) {
                this.params.okFn()
                // resolve(type)
            } else {
                this.params.cancelFn()
                // reject(type)
            }
            // })
        },
        closePop() {
            if (this.params.blank) {
                this.params.show = false
                this.params.cancelFn()
            }
        }
    },
    watch: {
        params: {
            // 动画显示与显示先后顺序处理
            handler(val) {
                // console.log(val)
                // this.setData({
                //     'closePopState': true
                // })
                if (val.type === 'close') {
                    this.pop = false
                    this.params.show = false
                    return
                }

                let showState = val.show
                let type = val.type
                if (timer) clearTimeout(timer)
                if (type === 'confirm' || type === 'alert' || type === 'desc') {
                    if (showState) {
                        this.pop = showState
                        timer = setTimeout(() => {
                            this.classShow = showState
                            this.layerShow = showState
                        }, 50)
                    } else {
                        this.classShow = showState
                        this.layerShow = showState
                        timer = setTimeout(() => {
                            // console.log(showState)
                            this.pop = showState
                        }, 302)
                    }
                } else if (type === 'toast') {
                    let time = this.params.duration || 2000
                    this.pop = showState
                    timer = setTimeout(() => {
                        this.params.show = false
                        this.params.complete()
                    }, time)
                } else {
                    this.pop = showState
                }
            },

            deep: true
        }
    },
    created() {
    }

}
</script>
<style lang="less" scoped>
.layer {
    transition: all 0.3s;
    opacity: 0;
}
.layer.show {
    opacity: 1;
}
.confirm-box,
.desc {
    width: 600px;
    height: auto;
    transition: all 0.2s;
    transform-origin: 0 0;
    transform: scale(0.7) translate3d(-50%, -50%, 0);
    opacity: 0;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    // margin-left:-300px;
}

.confirm-box.show,
.desc.show {
    transform: scale(1) translate3d(-50%, -50%, 0);
    opacity: 1;
}

.title {
    height: 94px;
    width: 100%;
    color: #333;
    line-height: 94px;
    font-size: 32px;
    position: relative;
}
.content {
    padding: 30px;
    white-space: wrap;
    font-size: 26px;
}
.btn {
    height: 88px;
    line-height: 88px;
    font-size: 28px;
    &:not(:only-child):first-child {
        border-right: 1px solid #f3f3f3;
    }
    // &:only-child {
    //     border-right: none;
    // }
}
#pop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
}
.toast {
    // height: );
    font-size: 26px;
    min-width: 240px;
    position: fixed;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 16px;
    padding: 20px;
    p {
        padding-top: 10px;
        &:only-child {
            padding-top: 0;
        }
    }
}
.tclayer-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10087;
    display: flex;
    align-items: center;
    height: 80px;
    overflow: hidden;
    font-size: 28px;
    color: #fff;
    text-align: center;
    background-color: #333;
    border-radius: 10px;
    transform: translate3d(-50%, -55%, 0);

    .tclayer-loading-icon {
        // width: 58px;
        // background: url(//img1.40017.cn/touch/bus/wx_bus/icload.png) no-repeat;
        // background-size: 58px 118px;

        position: relative;
        display: block;
        height: 58px;
        margin-left: 14px;
        background-position: 0 -70px;
        .tclayer-loading-pic {
            width: 58px;
            background: url(//img1.40017.cn/touch/bus/wx_bus/icload.png) no-repeat;
            background-size: 58px 118px;

            height: 58px;
            background-position: 0 0;
            animation: tclayer-loadroate 0.5s linear infinite;
        }
    }
    .tclayer-loading-text {
        flex: 1;
        min-width: 140px;
        max-width: 320px;
        padding: 0 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.desc {
    // position: fixed;
    // top: 50%;
    // left: 50%;
    // right: 0;
    width: 88%;
    z-index: 1020;
    // background: #fff;
    //  transform: translate3d(-50%, -55%, 0);
    padding: 30px;
    padding-bottom: 10px;
    .title {
        margin-bottom: 16px;
        padding: 4px 10px 0;
    }
    h1 {
        color: #fff;
        text-align: center;
        font-size: 32px;
        height: 8vh;
        line-height: 8vh;
        font-weight: normal;
    }

    .content {
        // height: 77vh;
        padding: 0 10px 20px;
        line-height: 2;
        // color: #fff;
        font-size: 28px;
        text-align: justify;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        word-break: break-all;
    }
    .btn {
        font-size: 36px;
    }
    .close {
        position: absolute;
        top: 0;
        right: 0;
        // line-height:
    }
}
@keyframes tclayer-loadroate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>

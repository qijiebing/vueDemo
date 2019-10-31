<!--- 基本模板 --->
<template>
    <div class="list">
        <div class="box" v-for="son in skeList" :key="son">
            <div class="main">
                <p class="time"></p>
                <div class="station">
                    <div class="dep"></div>
                    <div class="dep"></div>
                </div>
                <p class="price"></p>
            </div>
            <div class="info">
                <div class="line">
                    <p class="trip"></p>
                    <div class="type"></div>
                    <p class="surplus"></p>
                </div>
                <div class="add">
                    <p class="trip"></p>
                    <p class="type"></p>
                    <p class="surplus"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            skeList: [1, 2, 3, 4, 5, 6]
        }
    }
}
</script>

<style lang="less" scoped>
.list {
    padding: 20px 10px 0;

    .box {
        position: relative;
        background-color: #fff;
        padding: 16px 30px 28px;
        margin-bottom: 20px;
        border-radius: 20px;
        overflow: hidden;

        .main {
            display: flex;
            align-items: center;

            .time {
                padding-right: 40px;

                &::after {
                    content: '';
                    display: block;
                    background-color: #f1eff2;
                    width: 130px;
                    height: 50px;
                }
            }

            .station {
                flex: 1;

                .dep {
                    position: relative;
                    padding: 16px 30px 16px 40px;

                    &::before {
                        content: '';
                        position: absolute;
                        top: 16px;
                        left: 0;
                        background-color: #f1eff2;
                        width: 24px;
                        height: 30px;
                    }

                    &::after {
                        content: '';
                        display: block;
                        background-color: #f1eff2;
                        height: 30px;
                    }
                }
            }

            .price {
                background-color: #f1eff2;
                width: 70px;
                height: 60px;
            }
        }

        .info {
            padding-top: 12px;

            .line {
                display: flex;

                .trip {
                    padding-right: 40px;

                    &::after {
                        content: '';
                        display: block;
                        background-color: #f1eff2;
                        width: 130px;
                        height: 24px;
                    }
                }

                .surplus {
                    background-color: #f1eff2;
                    width: 70px;
                    height: 24px;
                }
            }

            .add {
                display: flex;
                padding-top: 20px;

                .trip {
                    width: 170px;
                }

                .surplus {
                    width: 70px;
                }
            }

            .type {
                position: relative;
                flex: 1;
                padding: 0 30px 0 40px;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-color: #f1eff2;
                    width: 24px;
                    height: 24px;
                }

                &::after {
                    content: '';
                    display: block;
                    background-color: #f1eff2;
                    height: 24px;
                }
            }
        }
    }
}
</style>

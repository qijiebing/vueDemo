<template>
    <div class="intl-tel-input allow-dropdown">
        <div class="dial-codes" @click="showPop">+{{currentData.dialCode}}
            <md-icon
                :name="arrName"
                size="md"
            ></md-icon>
        </div>
        <div class="flag-container" style="display:none">
            <div
              class="selected-flag"
              :title="currentData.name + ': +' + currentData.dialCode"
              @click="hideSubMenu = !hideSubMenu,isPickerShow = !isPickerShow"
            >
                <!-- <div :class="'iti-flag ' + currentData.code"></div> -->
                <!-- <div class="iti-arrow"></div> -->
            </div>
            <ul class="country-list" v-show="!hideSubMenu && falseD">
                <li
                  v-for="item in frontCountriesArray"
                  :key="item.id"
                  :class="'country ' + (item.code == currentCode ? 'highlight' : '')"
                  @click="currentCode = item.code; hideSubMenu = true; setCountry(item);"
                >
                    <div class="flag-box">
                      <div :class="'iti-flag ' + item.code"></div>
                    </div>
                    <span class="country-name">{{ item.name }}</span>
                    <span class="dial-code">+{{ item.dialCode }}</span>
                </li>
                <li class="divider"></li>
                <li
                  v-for="item in countriesArray"
                  :key="item.id"
                  :class="'country ' + (item.code == currentCode ? 'highlight' : '')"
                  @click="currentCode = item.code; hideSubMenu = true; setCountry(item);"
                >
                    <div class="flag-box">
                        <div :class="'iti-flag ' + item.code"></div>
                    </div>
                    <span class="country-name">{{ item.name }}</span>
                    <span class="dial-code">+{{ item.dialCode }}</span>
                </li>
              </ul>
        </div>

        <md-picker
            ref="picker"
            v-model="isPickerShow"
            :data="[pickerData]"
            :default-index="pickerDefaultIndex"
            :default-value="pickerDefaultValue"
            :ok-text="$t('确认')"
            :cancel-text="$t('取消')"
            @confirm="onPickerConfirm()"
            :title="$t('选择区号')"
        ></md-picker>

    </div>
</template>
<script>
import countries from './countryList'
// import simple from 'mand-mobile/components/picker/demo/data/simple'
import { Picker, Icon } from 'mand-mobile'
export default {
    props: {
        toFront: {
            type: Array,
            default: () => {
                return []
            }
        },
        countryCode: {
            type: String,
            default: Object.keys(countries)[0],
            validator(code) {
                var clearCode = String(code).toLowerCase()
                return !!countries[clearCode]
            }
        },
        validateFlag: {
            type: String,
            default: '2'
        },
        phoneAreaCode: {
            type: String,
            default: ''
        }
    },
    components: {
        [Picker.name]: Picker,
        [Icon.name]: Icon
    },

    data() {
        return {
            currentCode: this.countryCode,
            hideSubMenu: true,
            isPickerShow: false,
            pickerData: [],
            falseD: false,
            pickerDefaultIndex: [],
            pickerDefaultValue: [],
            arrName: 'arrow-down'
        }
    },

    computed: {
        currentData() {
            return countries[this.currentCode]
        },
        frontCountriesArray() {
            const toFrontCodes = {}
            this.toFront.forEach(code => {
                const stringCode = String(code)
                const needObj = countries[stringCode]

                if (needObj) {
                    toFrontCodes[stringCode] = needObj
                }
            })
            return toFrontCodes
        },
        countriesArray() {
            const countryCopie = { ...countries }
            this.toFront.forEach(code => {
                delete countryCopie[code]
            })
            return countryCopie
        }
    },
    watch: {
        countryCode(newCode) {
            this.setCountry(countries[newCode])
        },
        isPickerShow(newc) {
            if (newc) {
                this.arrName = 'arrow-up'
            } else {
                this.arrName = 'arrow-down'
            }
        }
    },
    methods: {
        showPop() {
            if (Number(this.validateFlag) === 1) { return }
            this.isPickerShow = !this.isPickerShow
        },
        setCountry(item) {
            this.currentCode = item.code
            this.toFront.push(String(item.code))
            console.log(item)
            this.$emit('getback', item)
            // this.$emit('excountry', item)
        },
        onPickerConfirm() {
            let values = this.$refs['picker'].getColumnValues()
            let item = values[0]['value']
            this.currentCode = item.code
            this.toFront.push(String(item.code))
            this.$emit('getback', item)
            // console.log(values)
        }
    },
    mounted() {
        let pickerData = []
        let defaultIndex = 0
        let defaultValue = ''
        for (let index in countries) {
            if (this.countryCode === index) {
                defaultIndex = pickerData.length
                defaultValue = countries[index]['name'] + '+' + countries[index]['dialCode']
            }
            pickerData.push({
                text: countries[index]['name'] + '+' + countries[index]['dialCode'],
                value: countries[index]
            })
        }
        this.pickerData = pickerData
        this.pickerDefaultIndex = [defaultIndex]
        this.pickerDefaultValue = [defaultValue]
        // console.log(pickerData)
        // this.$emit('excountry', countries[this.countryCode])
    }
}
</script>
<style lang="less" scoped>
@import "intl.css";
.intl-tel-input {
    width: 100%;
    height: 80px;
    color: #666;
    font-size: 24px;
    .country-list {
        width: 570px;
        height: 500px;
        margin-top: 2px;
        z-index: 99;
    }
}
.dial-codes{
    width: 100%;
    height: 80px;
    z-index:9;
    line-height: 110px;
    font-size: 36px;
    text-align: center;
    color: #fff;
    font-weight: bold;
}
</style>

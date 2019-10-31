/**
 * Created by gh on 2019/3/22.
 * author is zr02718 ,copy from linebus.fed.all
 */
export default function adapt(designWidth, rem2px) {
    var d = window.document.createElement('div')
    d.style.width = '1rem'
    d.style.display = 'none'
    var head = window.document.getElementsByTagName('head')[0]
    head.appendChild(d)
    var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'))
    d.remove()
    document.documentElement.style.fontSize = (((window.innerWidth / designWidth) * rem2px) / defaultFontSize) * 100 + '%'
    var st = document.createElement('style')
    var portrait = '@media screen and (min-width: ' + window.innerWidth + 'px) {html{font-size:' + (window.innerWidth / (designWidth / rem2px) / defaultFontSize) * 100 + '%;}}'
    var landscape = '@media screen and (min-width: ' + window.innerHeight + 'px) {html{font-size:' + (window.innerHeight / (designWidth / rem2px) / defaultFontSize) * 100 + '%;}}'
    st.innerHTML = portrait + landscape
    head.appendChild(st)
    return defaultFontSize
}
// 750的设计稿 1rem = 50px 类比 15rem = 100%
// var defaultFontSize = adapt(750, 50)

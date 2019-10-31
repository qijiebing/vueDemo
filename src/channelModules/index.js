// console.log(global)
/*
 * 注：evs如果使用diff的话
 * diff渠道为差异渠道，非diff渠道为通用渠道
 * 非diff的通用渠道不需要加渠道后缀
 * 如果只有单一渠道的话，非diff渠道同样需要存在导出
 * 此方式固定
 */

function getComponent(name, evs) {
    let envs = ''
    let path = ''

    return function(ev) {
        ev = ev || evs
        // console.log('components:' + name)
        if (!!ev && ev.indexOf('diff') > -1) {
            let evArr = ev.split(':')
            if (window.env === evArr[1]) {
                path = `_${evArr[1]}`
            }
        } else {
            envs = !ev ? window.env : ev
            path = `_${envs}`
        }
        // console.log(`filePath:./${name}/${name}${path}.js`)
        return import(`./${name}/${name}${path}.js`).then(Compt => {
            return Compt.default
        })
    }
}

/**
 * login(fn(obj,boo),Boolean)
 * fn接收两个参数 object-会员信息 boo-是否已经登录
 * Boolean-未登录时，是否自动跳转登录
 */
export const login = getComponent('login')
export const pay = getComponent('pay')
export const impower = getComponent('impower', 'diff:wx')
export const getLocation = getComponent('getLocation')

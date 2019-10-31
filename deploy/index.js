/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-expressions */
/**
 * 自动执行git命令
 *
 * author:gh6331
 *
 */

const execSync = require('child_process').execSync
const chalk = require('chalk')
// const process = require('process')
let argv

// console.log(process)
try {
    // argv = process.argv;
    argv = JSON.parse(process.env.npm_config_argv).original
} catch (e) {
    argv = process.argv
    console.log('系统暂未兼容命令')
    return
}

let envTag = argv[2] ? argv[2].replace(/\-/g, '') : 'stage'
// console.log(channel)

// 冲突标记
const isConflictRegular = '^<<<<<<<\\s|^=======$|^>>>>>>>\\s'
let results
let version = Math.floor(new Date().getTime() / 1e3)

// console.log(process.argv)
try {
    // git grep 命令会执行 perl 的正则匹配所有满足冲突条件的文件
    results = execSync(`git grep -n -P "${isConflictRegular}"`, {
        encoding: 'utf-8'
    })
} catch (e) {
    try {
        // throw Error('22')
        console.log(
            chalk.yellow('【没有发现冲突，开始 执行git提交及创建tag命令...】')
        )
        console.log('')
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(`开始 add...`)}`
        )
        results = execSync(`git add -A `, { encoding: 'utf-8' })
        console.log(results)
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                'add结束， 开始commit...'
            )}`
        )
        try {
            results = execSync(`git commit -m 'build_version_${version}' `, {
                encoding: 'utf-8'
            })
            console.log(results)
            console.log(
                `[${chalk.gray(timestamp())}] > ${chalk.green(
                    'commit结束， 开始pull...'
                )}  `
            )
        } catch (e) {
            console.log('没有内容提交')
        }

        results = execSync(`git pull `, { encoding: 'utf-8' })
        console.log(results)
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                'pull结束， 开始push...'
            )}`
        )

        results = execSync(`git push `, { encoding: 'utf-8' })
        console.log(results)

        // return
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                'push结束， 开始打tag...'
            )}`
        )
        console.log('')
        results = execSync(`git tag `, {
            encoding: 'utf-8'
        })
        let tag = initTag(results)
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                `taglist获取完毕，新tag为${tag}`
            )}`
        )
        console.log('')

        // console.log(
        //     `[${chalk.gray(timestamp())}] > ${chalk.green(`开始创建基础tag`)}`
        // )
        // results = execSync(
        //     `git tag -a base.${tag} -m "add base tag base.${tag}"`,
        //     {
        //         encoding: 'utf-8'
        //     }
        // )
        // console.log(results)
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                `开始创建${envTag}环境tag`
            )}`
        )

        results = execSync(
            `git tag -a v.${envTag}.${tag} -m "add ${envTag} tag v.${envTag}.${tag}"`,
            {
                encoding: 'utf-8'
            }
        )
        console.log(results)

        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                `tag版本号 ${tag}， 开始发布tag...`
            )} `
        )
        results = execSync(`git push origin --tags`, { encoding: 'utf-8' })
        console.log(results)
        console.log(
            `[${chalk.gray(timestamp())}] > ${chalk.green(
                ` ^~^ tag发布成功，天梯将进行stage环境自动部署 ----- 部署版本为 ${tag} ^~^\n\n= = = = = = = = = = = = = = =\n= 请到天梯系统查看发布结果  =\n= = = = = = = = = = = = = = =\n`
            )}`
        )
        console.log('')
        setTimeout(() => {
            console.log('done')
        }, 10000);
        // process.exit()
    } catch (err) {
        console.log(err)
        console.log('')
        console.log('')
        console.log(
            chalk.red(
                ` >>>>>>>>>>>>>>>发现冲突，请解决后再提交，冲突文件<<<<<<<<<<<<<<<<<< `
            )
        )
        console.error(err.trim())
        console.log('')
        console.log('')
        console.log(
            chalk.red(' >>>>>>>>>>>>>>>自动上传失败<<<<<<<<<<<<<<<<<< ')
        )
        console.log('')
        console.log('')
        setTimeout(() => {
            console.log('done')
        }, 10000);
        // process.exit()
    }
}

function initTag(tags) {
    let tagsTemp = []

    tags = tags.toString().split('\n')
    // console.log(tags)

    // tags.forEach(ele => {
    //     ele.includes('base')
    //         ? tagsTemp.push(
    //             parseInt(ele.split('base.')[1].replace(/\./g, '')) + 10000
    //         )
    //         : ''
    // })
    // console.log(tags)
    // console.log(envTag)
    tags.forEach(ele => {
        ele.includes(`${envTag}`)
            ? tagsTemp.push(
                parseInt(ele.split(`${envTag}.`)[1].replace(/\./g, '')) +
                      10000
            )
            : ''
    })
    tagsTemp.sort((a, b) => {
        return b - a
    })
    tagsTemp[0]++
    return tagsTemp[0]
        .toString()
        .split('')
        .join('.')
        .substr(2, 8)
}

function timestamp() {
    // let time = new time()
    return new Date().toString().split(' ')[4]
}

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const list = []
const orgs = {}

const getTitle = async (url) => {
    const {data} = await axios.get(url)
    const $ = cheerio.load(data)

    const element = await $('body > main > section > div > ul > li')
    const len = element.length
    
    for(i=1;i<=len;i++){
        //title
        const title = await $(`body > main > section > div > ul > li:nth-child(${i}) > a > md-card > div > h4`).text()
        //link
        const piece = await $(`body > main > section > div > ul > li:nth-child(${i}) > a`).attr('href')
        const link = 'https://summerofcode.withgoogle.com' + piece

        //get orgs techs
        const {data} = await axios.get(link)
        const nP = cheerio.load(data)
        
        const el = await nP('div[class="org__meta"] > div:nth-child(4) > ul > li')
        const len2 = el.length
        const list2 = []
        list.push({title, link})
        for (var j=1; j<=len2; j++){
            const el2 = await nP(`div[class="org__meta"] > div:nth-child(4) > ul > li:nth-child(${j})`)
            const txt = await el2.text()
            list2.push(txt)
        }
        list[i-1].techStack = list2
        console.log(list[i-1])
    }
    orgs.list = list
    fs.writeFileSync(path.resolve(__dirname, 'orgs.json'), JSON.stringify(orgs));
}

getTitle('https://summerofcode.withgoogle.com/archive/2019/organizations/')
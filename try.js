const axios = require('axios')
const cheerio = require('cheerio')

const getTitle = async (url) => {
    const {data} = await axios.get(url)
    const $ = cheerio.load(data)
    
    const element = await $('div[class="org__meta"] > div:nth-child(4) > ul > li')
    const len = element.length

    for (var i=1; i<=len; i++){
        const el = await $(`div[class="org__meta"] > div:nth-child(4) > ul > li:nth-child(${i})`)
        const txt = await el.text()
        console.log({txt})
    }
    console.log(len)
}

getTitle('https://summerofcode.withgoogle.com/archive/2019/organizations/6331236958601216/')
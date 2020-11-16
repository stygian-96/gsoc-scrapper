const fsp = require('fs').promises;
const path = require('path')

const getArrayofTitle = async() => {
    const list = []
    let fileData = await fsp.readFile(path.resolve(__dirname, 'orgs2.json'))
    let obj = JSON.parse(fileData)
    const listYears = [
        'list2009',
        'list2010',
        'list2011',
        'list2012',
        'list2013',
        'list2014',
        'list2015',
        'list2016',
        'list2017',
        'list2018',
        'list2019'
    ]
    listYears.forEach( listYear => {
        let len = obj[`${listYear}`].length
        for(let i=0; i<len; i++){
            list.push(obj[`${listYear}`][i].title)
        }
    })
    list.sort()
    let len = list.length
    let match = list[0].trim().split(' ').join('').toLowerCase()
    let count = 1
    const ob = {}
    for(let i=1;i<len;i++){
        let str = list[i].trim().split(' ').join('').toLowerCase()
        if(str === match){
            count++
        } else{
            ob[`${match}`] = count
            match = str
            count = 1
        }
    }
    listYears.forEach(listYear => {
        let len = obj[`${listYear}`].length
        for(var i=0 ;i<len;i++){
            let titleTrim = obj[`${listYear}`][i].title.trim().split(' ').join('').toLowerCase()
            obj[`${listYear}`][i][`noOfTimes`] = ob[titleTrim]
        }
    })
    console.log(obj)
    await fsp.writeFile(path.resolve(__dirname, 'orgs2.json'), JSON.stringify(obj));
}

getArrayofTitle()
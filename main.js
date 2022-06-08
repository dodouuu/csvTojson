const fs = require('fs')

class Drama {
  constructor(name, name_en, year, episode, labels) {
    this.name = name
    this.name_en = name_en
    this.year = year
    this.episode = episode
    this.labels = [...labels]
  }
}

class Dramas {
  constructor() {
    this.dramas = []
  }

  newDrama(name, name_en, year, episode, labels) {
    let d = new Drama(name, name_en, year, episode, labels)
    this.dramas.push(d)
    // console.log('d=', d)
    return d
  }
  get allDramas() {
    return this.dramas
  }
  get numberOfDramas() {
    return this.dramas.length
  }
}

let dramaArray = new Dramas()
let numberOfDrama = 0

fs.readFile('./data.csv', function (error, data) {
  // 當檔案讀取成功時：
  // data → 檔案內的二進制數據
  // error → null

  // 當檔案讀取失敗時(如路徑錯誤，或是檔案不存在)：
  // data → undefined
  // error → 一個物件

  if (error) {
    console.log('讀取檔案失敗')
    return
  }
  // console.log(data)
  // console.log(data.toString())
  const rawData = data.toString()
  parseRawDataToDramaArray(rawData)

  dramaArrayToJson()
})

function parseRawDataToDramaArray(data) {
  // console.log('hello')
  const l = data.length
  // console.log(l)

  let i = 0 // index of data
  let j = 0 // index of Drama property
  let str = '' // each value
  let character = '' // each character of data

  // 第一行讀取 key
  let eOL = false // end of line
  while (!eOL) {
    character = data[i]
    if (character === '\n') {
      eOL = true
    } else {
    }
    i++
  }
  // console.log('now i=', i)

  // 第二行開始是每一部劇的 value
  while (i < l) { // l = data.length
    let name = ''
    let name_en = ''
    let year = 0
    let episode = 0
    let labels = []
    j = 0
    eOL = false
    while (!eOL && i < l) { // 一個 while 讀取一部劇的資料
      character = data[i]
      // console.log('char=', character)
      if (character === '\n') {
        eOL = true
      } else if (character === ',') {
        if (j === 0) {
          name = str
        } else if (j === 1) {
          name_en = str
        } else if (j === 2) {
          year = Number(str)
        } else if (j === 3) {
          episode = Number(str)
        } else if (j >= 4 && str !== '') {
          labels.push(str)
        }
        // console.log('j=', j)
        // console.log('str=', str)
        j++
        str = ''
      } else {
        if (character !== String.fromCharCode(13)) {
          str += character
        }
      }
      i++
    }

    dramaArray.newDrama(name, name_en, year, episode, labels)
    // console.log('name=', dramaArray.dramas[numberOfDrama].name)
    // console.log('nameEn=', dramaArray.dramas[numberOfDrama].name_en)
    // console.log('y=', dramaArray.dramas[numberOfDrama].year)
    // console.log('e=', dramaArray.dramas[numberOfDrama].episode)
    // console.log('drama labels=', dramaArray.dramas[numberOfDrama].labels)
    numberOfDrama++
    // console.log('numD=', numberOfDrama)
  }

}

// 把 dramaArray.dramas[] 轉成 json 
function dramaArrayToJson() {
  console.log('numD=', numberOfDrama)
  let str = '{"dramas":['
  for (let i = 0; i < numberOfDrama; i++) {
    str += '{'
    str += "\"name\":\""
    str += dramaArray.dramas[i].name
    str += "\",\"name_en\":\""
    str += dramaArray.dramas[i].name_en
    str += "\",\"year\":"
    str += dramaArray.dramas[i].year
    str += ",\"episode\":"
    str += dramaArray.dramas[i].episode
    str += ",\"labels\":["
    const l = dramaArray.dramas[i].labels.length
    for (let j = 0; j < l; j++) {
      str += "\""
      str += dramaArray.dramas[i].labels[j]
      if (j < l - 1) {
        str += "\","
      } else {
        str += "\""
      }
    }
    str += "]"
    if (i < numberOfDrama - 1) {
      str += '},'
    } else {
      str += '}'
    }

  }
  str += ']}'

  fs.writeFile('./drama.json', str, function (error) {
    if (error) {
      console.log(error)
      return
    }
    // 當檔案寫入成功時： error → null
    // 當檔案寫入失敗時： error → 一個物件
    console.log('文件寫入成功')
  })
}


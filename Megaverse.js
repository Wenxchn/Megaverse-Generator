const axios = require('axios')
const candidateId = '15851723-b35f-4441-8603-3893b5e75330'
axios.defaults.baseURL = 'https://challenge.crossmint.io/api'

class coordinate {
  constructor(row, col) {
    this.row = row
    this.col = col
  }
}

const polyanetCoordinates = new Array()

const InsertPolyanetCrossCoordinates = async () => {
  for (let i = 2; i < 9; i++) {
    // Insert the left portion of the cross
    polyanetCoordinates.push(new coordinate(i, i))
    // Insert the right portion of the cross but skip the center since it was added from the left
    if (i !== 5) {
      polyanetCoordinates.push(new coordinate(i, 10 - i))
    }
  }
}

const CreatePolyanetCross = async () => {
  try {
    await InsertPolyanetCrossCoordinates()
    for (let i = 0; i < polyanetCoordinates.length; i++) {
      const row = polyanetCoordinates[i].row
      const col = polyanetCoordinates[i].col
      const res = await axios.post('/polyanets', {
        row: row,
        column: col,
        candidateId: candidateId,
      })
      console.log(`(${row},${col})`)
      console.log(res)
      // Used to prevent API limit rate
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    console.log('PolyanetCross Generated')
  } catch (err) {
    console.log(err)
  }
}

CreatePolyanetCross()

const CreateCrossmintLogo = async () => {
  try {
    const res = await axios.get(`/map/${candidateId}/goal`)
    const goal = res.data.goal

    for (let row = 0; row < goal.length; row++) {
      const goalRow = goal[row]
      for (let col = 0; col < goalRow.length; col++) {
        const goalEntity = goalRow[col]
        if (goalEntity === 'SPACE') {
          continue
        } else if (goalEntity === 'POLYANET') {
          await axios.post('/polyanets', {
            row: row,
            column: col,
            candidateId: candidateId,
          })
        } else if (goalEntity.includes('SOLOON')) {
          const color = goalEntity.split('_')[0].toLowerCase()
          await axios.post('/soloons', {
            row: row,
            column: col,
            candidateId: candidateId,
            color: color,
          })
        } else {
          const direction = goalEntity.split('_')[0].toLowerCase()
          await axios.post('/comeths', {
            row: row,
            column: col,
            candidateId: candidateId,
            direction: direction,
          })
        }
        console.log(`(${row},${col})`)
        console.log(res)
        // Used to prevent API limit rate
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    console.log('Crossmint Logo Generated')
  } catch (err) {
    console.log(err)
  }
}

CreateCrossmintLogo()

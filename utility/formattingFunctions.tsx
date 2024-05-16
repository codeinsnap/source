export const trimDownOneDecimal = (num: any) => { //12.12 -> 12.1
    return Math.floor(num * 10) / 10;
  }

export const trimUpOneDecimal = (num: any) => { //12.12 -> 12.2
    return Math.ceil(num * 10) / 10;
  }
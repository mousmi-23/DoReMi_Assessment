const fs = require("fs")
//var data;
const moment = require('moment');

const filenameData = fs.readFileSync(`${process.argv[2]}`).toString()
var data = filenameData.toString().split("\n")

let MUSIC = {
    FREE: { amount: 0, time: 1 },
    PERSONAL: { amount: 100, time: 1 },
    PREMIUM: { amount: 250, time: 3 }
}
let VIDEO = {
    FREE: { amount: 0, time: 1 },
    PERSONAL: { amount: 200, time: 1 },
    PREMIUM: { amount: 500, time: 3 }
};
let PODCAST = {
    FREE: { amount: 0, time: 1 },
    PERSONAL: { amount: 100, time: 1 },
    PREMIUM: { amount: 300, time: 2 }
}

// below is the object of plans
let Plans = { MUSIC, VIDEO, PODCAST }

let topUp = {
    FOUR_DEVICE: { amount: 50, device: 4 },
    TEN_DEVICE: {
        amount: 100, device: 10
    },

}
let subPlan = {};
let planList = [];
let totalPrice = 0;
let TOPUPLIST = [];


function main(inputLines) {
    if (inputLines.length === 0) {
        console.log('please send input')
        return `please send input`
    }
    var output = []
    for (let inputString of inputLines) {
        if (inputLines) {
            let input = inputString.split(' ')
            if (input[0] == 'START_SUBSCRIPTION') {
                output = addDate(input[1].trim());
            } else if (input[0] == 'ADD_SUBSCRIPTION') {
                output = subScrip(input[1], input[2]);
            } else if (input[0] == 'ADD_TOPUP') {
                output = addTop(input[1], input[2]);

            } else if (input[0] == 'PRINT_RENEWAL_DETAILS') {
                output = printInfo()
            }
        }
    }

    return output;
}
const printInfo = () => {
    const info = []
    if (planList.length === 0) {
        console.log('SUBSCRIPTIONS_NOT_FOUND');
        return `SUBSCRIPTIONS_NOT_FOUND`;
    }
    for (j = 0; j < planList.length; j++) {
        console.log('RENEWAL_REMINDER ' + planList[j].type + ' ' + planList[j].enDate);
        info.push(`RENEWAL_REMINDER ${planList[j].type} ${planList[j].enDate}`)
    }
    console.log('RENEWAL_AMOUNT ' + totalPrice);
    info.push(`RENEWAL_AMOUNT  ${totalPrice}`);
    return info
}

const addTop = (device, num) => {
    if (subPlan.date == 'NULL') {
        console.log('ADD_TOPUP_FAILED INVALID_DATE');
        return `ADD_TOPUP_FAILED INVALID_DATE`;
    }
    if (planList.length === 0) {
        console.log('ADD_TOPUP_FAILED SUBSCRIPTIONS_NOT_FOUND');
        return `ADD_TOPUP_FAILED SUBSCRIPTIONS_NOT_FOUND`;
    }
    let checkSub = TOPUPLIST.find(item => item == device + '_' + num)
    if (checkSub) {
        console.log('ADD_TOPUP_FAILED DUPLICATE_TOPUP');
        return `ADD_TOPUP_FAILED DUPLICATE_TOPUP`;
    }
    let topInfo = topUp[device];
    let topPrice = topInfo.amount * num;
    totalPrice = totalPrice + topPrice;
    TOPUPLIST.push(device + '_' + num);
}

const subScrip = (type, plan) => {
    let planDetails = Plans[type];
    let month = planDetails[plan.trim()].time
    if (subPlan.date == 'NULL') {
        console.log('ADD_SUBSCRIPTION_FAILED INVALID_DATE');
        return `ADD_SUBSCRIPTION_FAILED INVALID_DATE`;
    }

    let enDate = moment(subPlan.date, "DD-MM-YYYY").add(month, 'M').format('DD-MM-YYYY');
    let obj = {
        type,
        plan,
        startDate: subPlan.date,
        enDate: moment(enDate, "DD-MM-YYYY").subtract(10, 'days').format('DD-MM-YYYY')
    }
    let checkSub = planList.find(item => item.type.trim() == type.trim())
    if (checkSub) {
        console.log('ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY');
        return `ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY`;
    }
    if (!checkSub) {
        planList.push(obj);
        totalPrice = totalPrice + planDetails[plan.trim()].amount
    }

}
const addDate = (dateStr) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (dateStr.match(regex) === null) {
        console.log('INVALID_DATE');
        subPlan.date = 'NULL';
        return "NULL";
    }
    const [day, month, year] = dateStr.split('-');
    const isoFormattedStr = `${year}-${month}-${day}`;
    const date = new Date(isoFormattedStr);
    const timestamp = date.getTime();
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        console.log('INVALID_DATE');
        subPlan.date = 'NULL';
        return "NULL";
    }
    subPlan.date = dateStr;

}
main(data);


module.exports.main = main
let item;
let priceDetailArray;
let nowPrice;


window.onload = function() {
    let i = 0;
    nowPrice = document.querySelector(".nowPrice");
    createDate();
    createData();

    setInterval(function() {
        createDate();
        // createData();
        endAuction();
    }, 1000);

};

function createDate() {
    let time = new Date();
    let finialTime = '<span style="font-size: 1.3em">(現在時間：' + time.toLocaleString() + ') </span>';
    document.querySelector("h3").innerHTML = finialTime;
}


function numberComma(num) {
    let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
    return num.toString().replace(comma, ',')
}


function createData() {
    let firebaseConfig = {
        // The value of `databaseURL` depends on the location of the database
        databaseURL: "https://realestate-6e133-default-rtdb.firebaseio.com/",
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Realtime Database and get a reference to the service
    let database = firebase.database();

    database.ref("/item").on('value', e => {
        item = e.val();
        if (item != null) {
            let itemArray = Object.values(item);

            while (true) {
                if (document.querySelectorAll("li").length == 0) {
                    document.querySelector('.nowPrice').textContent = '';
                    break;
                } else {
                    document.querySelectorAll("li")[0].remove();
                }
            }

            priceDetailArray = null;
            for (let i = 0; i < itemArray.length; i++) {
                if (itemArray[i].status == 2 && itemArray.endAuction == null && itemArray.nopeople == undefined) {
                    // console.log(itemArray[i].itemID)
                    
                    document.querySelector("h2").innerHTML = "<span style='color:blue'>股別：</span>" + itemArray[i].deptNo + "<br>" + "<span style='color:blue'>案號：</span><br>" + itemArray[i].execNo + "<br>" + "<span style='color:blue'>拍賣標的：</span><br>" + itemArray[i].itemName;
                    if (itemArray[i].price_detail != null) {
                        let webId = itemArray[i].itemID;
                        let webName = itemArray[i].itemName;
                        priceDetailArray = Object.values(itemArray[i].price_detail.li);
                    }
                }
            }
            let ul = document.querySelector("#myUL");
            // console.log(priceDetailArray);

            if (priceDetailArray != null) {
                for (let i = 0; i < priceDetailArray.length; i++) {
                    nowPrice.textContent = numberComma(priceDetailArray[i]['myInputPrice']);
                    console.log(nowPrice.textContent);
                }

                if (priceDetailArray.length != 0 && priceDetailArray[0]['myInputPeople'] != null) {
                    document.querySelector("li").setAttribute("class", "check");
                }

                let number = 0;
                for (let i = 0; i < priceDetailArray.length; i++) {
                    if (priceDetailArray[i]['myInputPeople'] == null) {
                        number++;
                    } else {
                        number++;
                    }
                }
            }
        }
    })
}

function endAuction() {
    let firebaseConfig = {
        // The value of `databaseURL` depends on the location of the database
        databaseURL: "https://realestate-6e133-default-rtdb.firebaseio.com/",
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }
    // firebase.initializeApp();

    // Initialize Realtime Database and get a reference to the service
    let database = firebase.database();

    database.ref("/item").once('value', e => {
        item = e.val();
        let nowNumber;
        if (item != null) {
            let itemArray = Object.values(item);

            // console.log(itemArray.length);
            let numberEndAuction = 0;
            let numberEndAuction2 = 0;
            let nopeopleCount = 0;

            for (let i = 0; i < itemArray.length; i++) {
                if (itemArray[i].status == 2) {
                    nowNumber = i;
                    break;
                }
            }
            for (let i = 0; i < itemArray.length; i++) {
                if (itemArray[i].status == 2 && itemArray[i].nopeople == 1) {
                    nopeopleCount += 1;
                }
            }
            if (nowNumber != null) {
                if (itemArray[nowNumber].status == 2 && itemArray[nowNumber].endAuction == 2) {
                    // console.log('1');
                    createData();
                } else if (itemArray[nowNumber].status == 2 && itemArray[nowNumber].nopeople == 1 && nopeopleCount <= 1) {
                    // console.log('2');
                    document.querySelector('.nowPrice').textContent = '無人得標';

                    while (true) {
                        if (document.querySelectorAll("li").length == 0) {
                            break;
                        } else {
                            document.querySelectorAll("li")[0].remove();
                        }
                    }
                } else if(nopeopleCount > 1){
                    // console.log('3');
                    while (true) {
                        if (document.querySelectorAll("li").length == 0) {
                            break;
                        } else {
                            document.querySelectorAll("li")[0].remove();
                        }
                    }
                    document.querySelector('.nowPrice').textContent = '無人得標';
                    document.querySelector("h2").innerHTML = "<span style='color:blue'>股別：</span>" + itemArray[nowNumber].deptNo + "<br>" + "<span style='color:blue'>案號：</span><br>" + itemArray[nowNumber].execNo ;

                }
                else if (itemArray[nowNumber].status == 1) {
                    //do nothing
                    console.log('4');
                }
            } else {
                document.querySelector('h2').textContent = '拍賣競買人投標';
                console.log('5');
            }
        }
    })
}

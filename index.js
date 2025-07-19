//const MQTT_HOST = "ws://" + window.location.hostname + ":1884";
const MQTT_HOST = "wss://05de5a2b71424521ba38cb5b434540e8.s1.eu.hivemq.cloud:8884/mqtt";
const lunisolarBirthday = {
	"三月十三" : "老爸生日",
	"五月十一" : "老媽生日",
};
const solarBirthday = {
	"04月07日" : "育典生日",
	"06月02日" : "瑞慶生日",
	"10月06日" : "老弟生日",
};
const lunisolarHoliday = {
  "十二月二十九" : "小年夜",
  "十二月三十" : "除夕夜",
	"正月初一" : "大年初一",
	"正月初二" : "大年初二",
	"正月初三" : "大年初三",
	"五月初五" : "端午節",
	"八月十五" : "中秋節",
};
const solarHoliday = {
	"01月01日" : "元旦",
	"02月28日" : "和平紀念日",
	"04月04日" : "兒童節",
	"05月01日" : "勞動節",
	"09月28日" : "教師節",
	"10月10日" : "國慶日",
	"10月25日" : "台灣光復節",
	"12月25日" : "行憲紀念日",
	"2026年04月05日" : "清明節",
	"2027年04月05日" : "清明節",
	"2028年04月04日" : "清明節",
	"2029年04月04日" : "清明節",
	"2030年04月05日" : "清明節",
	"2031年04月05日" : "清明節",
	"2032年04月04日" : "清明節",
	"2033年04月04日" : "清明節",
	"2034年04月05日" : "清明節",
	"2035年04月05日" : "清明節",
	"2036年04月04日" : "清明節",
	"2037年04月04日" : "清明節",
	"2038年04月05日" : "清明節",
	"2039年04月05日" : "清明節",
	"2040年04月04日" : "清明節",
	"2041年04月04日" : "清明節",
	"2042年04月04日" : "清明節",
	"2043年04月05日" : "清明節",
	"2044年04月04日" : "清明節",
	"2045年04月04日" : "清明節",
	"2046年04月04日" : "清明節",
	"2047年04月05日" : "清明節",
	"2048年04月04日" : "清明節",
	"2049年04月04日" : "清明節",
	"2050年04月04日" : "清明節",
	"2051年04月05日" : "清明節",
	"2052年04月04日" : "清明節",
	"2053年04月04日" : "清明節",
	"2054年04月04日" : "清明節",
	"2055年04月05日" : "清明節",
	"2056年04月04日" : "清明節",
	"2057年04月04日" : "清明節",
	"2058年04月04日" : "清明節",
	"2059年04月05日" : "清明節",
	"2060年04月04日" : "清明節",
	"2061年04月04日" : "清明節",
	"2062年04月04日" : "清明節",
	"2063年04月05日" : "清明節",
	"2064年04月04日" : "清明節",
	"2065年04月04日" : "清明節",
	"2066年04月04日" : "清明節",
	"2067年04月05日" : "清明節",
	"2068年04月04日" : "清明節",
	"2069年04月04日" : "清明節",
	"2070年04月04日" : "清明節",
	"2071年04月05日" : "清明節",
};

let client;

let cwb = Array.from(
	{ length: 16 },
	function (element, index) {
		return {};
	});;

$(window).resize(function() {
	setFullScreenBtnIcon();
});

$(function () {
	let toast = bootstrap.Toast.getOrCreateInstance($("#liveToast")[0]);
	$("#liveToast")
		.on("show.bs.toast", function() {
			$(this).parent().removeClass("d-none");
		})
		.on("hidden.bs.toast", function() {
			$(this).parent().addClass("d-none");
		});
	
	setFullScreenBtnIcon();
	$("#fullScreenBtn").click(toggleFullScreen);
	$("#refreshBtn").click(function() {
		toast.show();
		client.publish("refresh", "{}");
	});

	showDateTime();
	initializeMqtt();
});

function leadingZero(str, length) {
	let tmp = "";
	for (let i = 0 ; i < length - str.length ; i++) {
		tmp += "0";
	}
	tmp += str;
	
	return tmp;
}

function showDateTime() {
	let now = new Date();
	let delay = parseInt(now / 1000) * 1000 + 1500 - now;
	setTimeout(showDateTime, delay);
	
	let year = now.getFullYear().toString();
	let month = leadingZero((now.getMonth() + 1).toString(), 2);
	let dayOfMonth = leadingZero(now.getDate().toString(), 2);
	let hour = leadingZero(now.getHours().toString(), 2);
	let minute = leadingZero(now.getMinutes().toString(), 2);
	let second = leadingZero(now.getSeconds().toString(), 2);

	let dayOfWeek;
	switch (now.getDay()) {
	case 0:
		dayOfWeek = "週日";
		break;
	case 1:
		dayOfWeek = "週一";
		break;
	case 2:
		dayOfWeek = "週二";
		break;
	case 3:
		dayOfWeek = "週三";
		break;
	case 4:
		dayOfWeek = "週四";
		break;
	case 5:
		dayOfWeek = "週五";
		break;
	case 6:
		dayOfWeek = "週六";
		break;
	default:
		weekDay = "週？";
		break;
	}

	$("#timeString").text(`${hour}:${minute}:${second}`);
	$("#solarDateString").text(`${year}年${month}月${dayOfMonth}日 ${dayOfWeek}`);
	
	let lunisolarDate = LunisolarCalendar
		.ConvertTable[`${Number(year).toString(16).toUpperCase()}`][parseInt((new Date(year, month - 1, dayOfMonth) - new Date(year, 0, 1)) / 1000 / 24 / 60 / 60)];
	let lunisolarYear = parseInt(lunisolarDate / 512) % 64;
	let lunisolarMonth = parseInt(lunisolarDate / 32) % 16;
	let lunisolarDay = lunisolarDate % 32;
	let isLeapMonth = (parseInt(lunisolarDate / 32768) % 2 == 1);
		
	let lunisolarYearString =
		LunisolarCalendar.HeavenlyStemString[(lunisolarYear - 1) % LunisolarCalendar.HeavenlyStemString.length]
		+ LunisolarCalendar.EarthlyBranchString[(lunisolarYear - 1) % LunisolarCalendar.EarthlyBranchString.length];
	let chineseZodiacYearString =
		LunisolarCalendar.ChineseZodiacString[(lunisolarYear - 1) % LunisolarCalendar.ChineseZodiacString.length];
	let lunisolarMonthString = LunisolarCalendar.MonthString[lunisolarMonth - 1];
	let lunisolarDayString = LunisolarCalendar.DayString[lunisolarDay - 1];
	let leapMonthString = (isLeapMonth ? "閏" : "");
	
	$("#lunisolarDateString").text(`${lunisolarYearString}(${chineseZodiacYearString})年${leapMonthString}${lunisolarMonthString}月${lunisolarDayString}`);
	
	let dayNotes = [];
	Object
		.keys(lunisolarBirthday)
		.filter(i => !isLeapMonth && $("#lunisolarDateString").text().includes(i))
		.forEach(i => dayNotes.push({
			note: lunisolarBirthday[i],
			addClass: "birthday",
			removeClass: "text-dark holiday",
		}));
	Object
		.keys(solarBirthday)
		.filter(i => $("#solarDateString").text().includes(i))
		.forEach(i => dayNotes.push({
			note: solarBirthday[i],
			addClass: "birthday",
			removeClass: "text-dark holiday",
		}));
	Object
		.keys(lunisolarHoliday)
		.filter(i => !isLeapMonth && $("#lunisolarDateString").text().includes(i))
		.forEach(i => dayNotes.push({
			note: lunisolarHoliday[i],
			addClass: "holiday",
			removeClass: "text-dark birthday",
		}));
	Object
		.keys(solarHoliday)
		.filter(i => $("#solarDateString").text().includes(i))
		.forEach(i => dayNotes.push({
			note: solarHoliday[i],
			addClass: "holiday",
			removeClass: "text-dark birthday",
		}));

	if (dayNotes.length > 0) {
		let dateNote = dayNotes[now.getSeconds() % dayNotes.length];
		$("#holidayString")
			.addClass(dateNote.addClass)
			.removeClass(dateNote.removeClass)
			.html(dateNote.note);
	} else {
		$("#holidayString")
			.addClass("text-dark")
			.removeClass("birthday holiday")
			.html("&ensp;");
	}
}

function initializeMqtt() {
	const topics = [
		"device/+/temperature",
		"device/+/humidity",
		"cwb/+/+",
	];
	const options = {
//        username: "admin",
//        password: "password",
        username: "weather-clock-web",
        password: "1D456093fc09a854f227f677e3247e76",
        rejectUnauthorized: false,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
	};
	
	client = mqtt.connect(MQTT_HOST, options);
	client.on("connect", function () {
		console.log("connect");

		client.subscribe(topics, function (err) {
			if (!err) {
				client.publish("refresh", "{}")
			}
		});
	});
	client.on("error", function (err) {
		console.log("error : " + err);
	});
	client.on("close", function () {
		console.log("close");
	});
	client.on("message", onMqttReceiveMessage);
}

function onMqttReceiveMessage(topic, message, packet) {
	if (/^device\/[^\/]*\/[A-Za-z0-9]*$/g.test(topic)) {
		let deviceId = topic.match(/(?<=\/)[^\/]*(?=\/)/g)[0];
		let type = topic.match(/(?<=\/)[^\/]*(?=$)/g)[0];
		let value = JSON.parse(message).value;

		switch(type) {
		case "temperature":
			if (deviceId == "1") {
				$("#temperature").text(value);
			} else if (deviceId == "2") {
				$("#outdoorTemperature").text(value);
			}
			break;
		case "humidity":
			if (deviceId == "1") {
				$("#humidity").text(Number(value) == 100 ? "100." : value);
				if (Number(value) >= 70) {
					$("#humidity").parent("div").addClass("text-danger");
				} else {
					$("#humidity").parent("div").removeClass("text-danger");
				}
			} else if (deviceId == "2") {
				$("#outdoorHumidity").text(Number(value) == 100 ? "100." : value);
				if (Number(value) >= 70) {
					$("#outdoorHumidity").parent("div").addClass("text-danger");
				} else {
					$("#outdoorHumidity").parent("div").removeClass("text-danger");
				}
			}
			break;
		}
		return;
	}
	
	if (/^cwb\/[^\/]*\/[^\/]*$/g.test(topic)) {
		let location = topic.match(/(?<=\/)[^\/]*(?=\/)/g)[0];
		let type = topic.match(/(?<=\/)[^\/]*(?=$)/g)[0];
		
		switch(type) {
		case "12小時降雨機率":	// 天氣預報：12小時降雨機率
		case "最高溫度":			// 天氣預報：最高溫度
		case "最低溫度":			// 天氣預報：最低溫度
			type = type.replace(/^./, type[0].toLowerCase());
			let forecasts = JSON.parse(message.toString());

			for (let i = 0 ; i < forecasts.length && i < cwb.length ; i++ ) {
				let endTime = new Date(forecasts[i].endTime);
				cwb[i].daytime = endTime.getHours() == 6 ? "夜" : "日";
				cwb[i][type] = forecasts[i].value;
				
				if (endTime.getHours() == 6) {
					endTime.setDate(endTime.getDate() - 1);
				}
				cwb[i].date = `${endTime.getMonth() + 1}/${endTime.getDate()}`;
				cwb[i].isWeekend = (endTime.getDay() % 6 == 0);
			}
			break;
		default:
			return;
		}
		
		let count = 0;
		$(".weatherString").addClass("text-dark").attr("style", "").html("&ensp;<br>&ensp;");
		$(".weatherString").each(function(index, element) {
			if ((index == 0) && (cwb[count].daytime == "夜")) {
				return;
			} else if (count >= cwb.lenth) {
				return;
			}
			$(element).removeClass("text-dark");

			if ((cwb[count].date != undefined)
				&& (cwb[count].daytime != undefined)
				&& (cwb[count]["12小時降雨機率"] != undefined)
				&& (cwb[count]["最低溫度"] != undefined)
				&& (cwb[count]["最高溫度"] != undefined)) {
				$(element)
					.attr(
						"style",
						`color: hsla(${temperatureToHue(Number(cwb[count]["最高溫度"]))}, 100%, 70%, 1);`)
					.html(
						`${cwb[count].date} ${cwb[count].daytime} 降雨 ${cwb[count]["12小時降雨機率"]}%<br>`
						+ `溫度 ${cwb[count]["最低溫度"]}-${cwb[count]["最高溫度"]}°C`);
						
				if (cwb[count].isWeekend) {
					$(element).addClass("holiday");
				} else {
					$(element).removeClass("holiday");
				}
			}
			
			count++;
		});
	}
}

function setFullScreenBtnIcon() {
	if (isFullScreen()) {
		$("#fullScreenBtn").attr("title", "結束全螢幕");
		$("#fullScreenBtn").html('<i class="fa-solid fa-minimize"></i>');
	} else {
		$("#fullScreenBtn").attr("title", "啟動全螢幕");
		$("#fullScreenBtn").html('<i class="fa-solid fa-maximize"></i>');
	}
}

/*
 * The check expression from https://developer.mozilla.org/zh-TW/docs/Web/API/Fullscreen_API
 *   !document.fullscreenElement
 *   && !document.mozFullScreenElement
 *   && !document.webkitFullscreenElement
 *   && !document.msFullscreenElement
 * is not working when click F11 at chrome browser.
 *
 * Thus, I use the check expression from https://stackoverflow.com/questions/16755129/detect-fullscreen-mode
 */
function isFullScreen() {
	return ((screen.availHeight || screen.height - 30) <= window.innerHeight); 
}

// Please refer to https://developer.mozilla.org/zh-TW/docs/Web/API/Fullscreen_API
function toggleFullScreen() {
	// Let this button to loses focus.
	$("#fullScreenBtn").blur();
	
	if (!isFullScreen()) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

function temperatureToHue(temp) {
	// temperature 30~10 => hue 0~240
	return 240 * (30 - Math.min(30, Math.max(10, temp))) / 20;
}
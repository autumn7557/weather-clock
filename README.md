<p>
  <h3>雲端：HiveMQ</h3>
  MQTT broker，數據傳輸平台。<br><br>
  <img src="https://raw.githubusercontent.com/autumn7557/weather-clock/refs/heads/main/images/HiveMQ.jpg" width=600>
</p>

<hr>

<p>
  <h3>軟體：Node-RED</h3>
  每天早晚７點向中央氣象局取得板橋七日溫度預報、三日降雨機率預報，向 HiveMQ 發布數據。<br><br>
  <img src="https://raw.githubusercontent.com/autumn7557/weather-clock/refs/heads/main/images/Node-RED.jpg" width=600>
</p>

<hr>

<p>
  <h3>硬體：溫溼度感測器</h3>
  Waveshare ESP32-C6、BME280<br>
  每 60 秒收集即時室內外溫濕度，向 HiveMQ 發布數據。<br><br>
  <img src="https://raw.githubusercontent.com/autumn7557/weather-clock/refs/heads/main/images/Sensor.jpg" width=600>
</p>

<hr>

<p>
  <h3>硬體：畫面顯示</h3>
  <h4>Raspberry Pi 4、Waveshare 7.9 吋 400×1280 觸控螢幕</h4>
  透過瀏覽器顯示溫溼度氣象時鐘網站畫面<br>
  <a target="_blank" href="https://autumn7557.github.io/weather-clock/">https://autumn7557.github.io/weather-clock/ </a><br><br>
  <img src="https://raw.githubusercontent.com/autumn7557/weather-clock/refs/heads/main/images/Display_1.jpg" width=600><br>
  <img src="https://raw.githubusercontent.com/autumn7557/weather-clock/refs/heads/main/images/Display_2.jpg" width=600><br><br>
  介面下方會依溫度預報高低，以紅(高溫)至藍(低溫)色顯示。<br>
介面右上角會提示當日國農曆假日。<br>
介面左上角為全螢幕按鈕、氣象預報立即刷新按鈕。<br>
</p>

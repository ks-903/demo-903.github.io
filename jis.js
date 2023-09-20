window.onload = () => {
    const video  = document.querySelector("#camera");
    const canvas = document.querySelector("#picture");
    const se     = document.querySelector('#se');
    const ctx = canvas.getContext('2d');
  
    /** カメラ設定 */
    const constraints = {
      audio: false,
      video: {
        width: 300,
        height: 200,
        facingMode: "user"   // フロントカメラを利用する
        // facingMode: { exact: "environment" }  // リアカメラを利用する場合
      }
    };
    /**
     * カメラを<video>と同期
     */
    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };
    })
    .catch( (err) => {
      console.log(err.name + ": " + err.message);
    });
  
    /**
     * シャッターボタン
     */
     document.querySelector("#shutter").addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
  
      // 演出的な目的で一度映像を止めてSEを再生する
      video.pause();  // 映像を停止
      se.play();      // シャッター音
      setTimeout( () => {
        video.play();    // 0.5秒後にカメラ再開
      }, 500);
  
      // canvasに画像を貼り付ける
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    });
  };

      
//関連ファイルの読み込み
const config = {
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
};
const hands = new Hands(config);

//カメラからの映像をhands.jsで使えるようにする
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({image: video});
  },
  width: 600,
  height: 400
});
  


hands.setOptions({
  maxNumHands: 2,              //検出する手の最大数
  modelComplexity: 1,          //ランドマーク検出精度(0か1)
  minDetectionConfidence: 0.5, //手を検出するための信頼値(0.0~1.0)
  minTrackingConfidence: 0.5   //ランドマーク追跡の信頼度(0.0~1.0)
});


//形状認識した結果の取得
hands.onResults(results => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(results.image,0,0,canvas.width,canvas.height);
  
  if(results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach(marks => {
        // 各指の末端のランドマークを取得
        const fingerTips = [marks[4], marks[8], marks[12], marks[16], marks[20]];
  
        // 指の数をカウント
        let fingerCount = 0;
        for (let i = 0; i < fingerTips.length; i++) {
          // 画面の下半分に指がある場合にカウント
          if (fingerTips[i].y * canvas.height < canvas.height / 2) {
            fingerCount++;
          }
        }


        
        console.log(`検出された指の数: ${fingerCount}`);
        // ピースサインを検出する条件をチェック
      const OneSign = fingerCount === 1; // 1本の指を曲げた状態をピースサインとみなす 
      const isPeaceSign = fingerCount === 2; // 2本の指を曲げた状態をピースサインとみなす
      const isTreeSign = fingerCount === 3; // 3本の指を曲げた状態をピースサインとみなす
      const isForSign = fingerCount === 4; // 4本の指を曲げた状態をピースサインとみなす
      const isPaperSign = fingerCount === 5; // 5本の指を曲げた状態をピースサインとみなす
      const isCrash  = fingerCount === 0; 
      const nonCrash = fingerCount !== 02345;

        if (isPeaceSign) {
            // gestureVideo.play(); // ピースサインを認識したらビデオ再生
            
     } 
      
    
        // 指の数を div 要素に表示
      const fingerCountDisplay = document.getElementById('fingerCountDisplay');
      fingerCountDisplay.textContent = `検出された指の数: ${fingerCount}`;
     

    });

    
    results.multiHandLandmarks.forEach(marks => {
      // 緑色の線で骨組みを可視化
      drawConnectors(ctx, marks, HAND_CONNECTIONS, {color: '#0f0'});

      // 赤色でランドマークを可視化
      drawLandmarks(ctx, marks, {color: '#f00'});

      
    })
  }
});


camera.start()


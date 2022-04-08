var mineflayer = require("mineflayer");
var db = require("quick.db");

var ayar = {
  host: 'deneme.aternos.me', //Sunucu ip sini giriniz.
  port: "36702", //Sunucu portunuzu giriniz.
  username: "Botun İsmi", //Sunucuya giriş yapacak bot isminizi girin.
  version: false //Burayı değiştirmeyin.
};

var kayit = {
  authme: "yok", //Eğer sunucunuzda AuthMe eklentisi yoksa bu var yazısını yok olarak değiştirin.
  sifre: "ADMİN" //Buraya AuthMe varsa botun giriş yapması için şifreyi girin.
};

var automessage = false; //5 Dakika'da bir sunucuda botun mesaj atmasını istemiyorsan true yazısını false olarak değiştir.

var bot = mineflayer.createBot(ayar);

bot.on("chat", function(username, message) {
  if (username === bot.username) return;
  function intervalFunc() {
    bot.setControlState("sprint", true);
  }
  setInterval(intervalFunc, 7000);

  if (kayit.authme == "var") {
    let giris = db.fetch(`giris_${ayar.host}_${ayar.username}`);
    if (!giris) {
      bot.chat(`/register ${kayit.sifre} ${kayit.sifre}`); //Kayıt olmasını sağladık.
      console.log("Bot kayıt oldu!");
      db.set(`giris_${ayar.host}_${ayar.username}`, "tm");

      if (automessage == true) {
        setInterval(() => {
          bot.chat(''); // değiştirmek çok basit '' arasındaki yazıyı değiştirin yeter
        }, 1);
      }
    }
    if (giris) {
      bot.chat(`/login ${kayit.sifre}`); //Giriş yapmasını sağladık.
      console.log("Bot giriş yaptı!");

      if (automessage == true) {
        setInterval(() => {
          bot.chat(''); // değiştirmek çok basit '' arasındaki yazıyı değiştirin yeter
        }, 10000);
      }
    }
  }
});

bindEvents(bot);
function bindEvents(bot) {
  bot.on("error", function(err) {
    console.log("Bir hata oluştu!");
  });

  bot.on("end", function() {
    console.log("Bot sunucudan atıldı!");
    setTimeout(relog, 5000);
  });

  function relog() {
    console.log("Sunucuya Tekrardan Baglaniliyor...");
    bot = mineflayer.createBot(ayar);
    bot.on("chat", function(username, message) {
      if (username === bot.username) return;

      console.log("Bot tekrardan oyuna giriş yaptı!");
      bot.chat(`/login ${kayit.sifre}`);

      bot.setControlState("sprint", true);
    });

    bindEvents(bot);
  }
}

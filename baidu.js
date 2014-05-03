var casper = require('casper').create({
   verbose: true,
   logLevel: "debug"
});

casper.cli.drop("cli");
casper.cli.drop("casper-path");
if(casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    var usage = "Usage: casperjs baidu.js --user=$user --pwd=$pwd  --subject=$subject  --data=$data [--tag=$tag]";
    casper.echo(usage).exit();
}
var user = casper.cli.get('user');
var pass = casper.cli.get('pwd');
var subject = casper.cli.get('subject');
var data = casper.cli.get('data');
var tag = casper.cli.get('tag') || "";

casper.options.waitTimeout = 1000;
casper.options.viewportSize = {width:1024,height:768};
var url='http://hi.baidu.com/go/login#normal';
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
casper.start(url).then(function() {
   this.fill('form#TANGRAM__PSP_6__form',{
      'userName':user,
      'password':pass
   },true);
});
casper.waitForUrl(/home$/,function(){
   this.echo("The Current URL is: " + this.getCurrentUrl());
   this.click('li.text a');
},function timeout(){
   this.echo("Time out!!!").exit();
},5000);
casper.then(function() {
    this.evaluate(function(content){
       parent.document.querySelector('iframe#ueditor_0').contentDocument.querySelector('body').textContent = content;
    },data);
    this.click('#edui3_button_body');
    this.click('#edui5');
    this.click('#edui14_button_body');
    this.click('#edui19');
    this.sendKeys('#title',subject);
    this.sendKeys('input#tagInput', tag);
    this.click('a#qPubBtnSubmit');
});
casper.then(function() {
    //this.captureSelector('baidu.png','html');
    this.echo("Pub article Success!!!");
});

casper.run();

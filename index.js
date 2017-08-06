const Discord = require("discord.js");
const fs = require("fs");
var client = new Discord.Client();
const PREFIX = '!';
const TOKEN = fs.readFileSync("./token.txt", "utf8", function(err,data){
    console.log("Error Reading Login Token:\n"+data);
});//Get Token...This Is Just So My Token Doesnt Get Published To Github

//Get An Array Of The Raid Bosses
var raids_raw = fs.readFileSync("./Raid Bosses.txt", "utf8", function(err,data){
    console.log("Error Reading Raid Bosses:\n"+data);
});
var raids = raids_raw.split(',');

//Clear All Old Entries Out Of The Notify Lists
raids.forEach(function(element) {
    fs.writeFileSync("./notify/"+element.toString()+".json", "");    
}, this);

client.on("ready", ()=>{
    console.log("PokéNotify Is Up And Running!");
    //var channel = bot.channels.get("Enter Channel ID Here");
    //channel.sendMessage("Good Morning Raiders!");
});
client.on("message", function(message){
    //Cirumvent Loops
    if(message.author.equals(client.user)) return;
    //If Bot Is Speaking
    if (message.author.username.toString() == "Chocoyo" && message.content.startsWith('!!'))
    //Change To message.author.bot When It Comes Time For Use And Verify The Bot Is Speaking In The Correct Channel
    {
        notify(message.content.toString(),message);
        return;
    }
    //Filter Messages And Commands
    if(!message.content.startsWith(PREFIX)) return;    
    
    //Put Command In Array
    var command = message.content.toLowerCase().substring(PREFIX.length).split(" ");
    switch (command[0]) {
        case "pokebot"://Start Convo With User
            help(message);    
            break;
        case "pokébot":
            help(message);    
            break;
        case "notify"://Register For Notifaction
            if (command[1] == "type")
                type(message,command[2]);
            else
                message.author.sendMessage("Command Invalid!\nUsage: !notify type *insert pokemon here*");
            break;
        case "help"://Help Command
            help(message);    
            break;
        default://Default
            message.author.sendMessage("\""+ message.content.toString() +"\" Is Not A Command\n\n !help For Commands");
            break;
    }
});

function help(message){//Sends Help Message To User
    message.author.sendMessage("Hello! I Am The PokéBot\n"
                            +"Here Are The Things I Can Do:\n\n"
                            +"Notify You Of Pokemon Raids Of A Certain Type Ex. \"!notify type Lugia\"\n\n"
                            +"All Info Is Deleted At The End Of The Day So You Must Renotify Yourself The Next Day\n\n"
                            +"**Please Only Talk To Me In This Chat To Avoid Cultter In The Main Chat**");
}

function type(message,second){//Registers The User Under A Raid Type
    //Verify That The Pokemon They Chose Is Actualy In This List
    var registered = false;
    for(var i = 0; i < raids.length; i++)
    {
        if(raids[i] == second.toLowerCase())
        {
            //Read Notify File For That Boss
            var users_raw = fs.readFileSync("./notify/"+ second +".json", "utf8", function(err,data){
                console.log("Error Reading Notify List \""+second+"\":\n"+data);
            });
            users_raw = users_raw.replace(/\"<@/g,"");//Replace All Instances Of Those Characters
            users_raw = users_raw.replace(/>\"/g,"");
            var list = users_raw.split(",");
            var alreadyRegistered = false;
            list.forEach(function(element) {
                if(message.author.toString() == ("<@" + element + ">"))//Check To See If The User Is Already On That Notifacation List
                {
                    message.author.sendMessage("You Are Already Registered For " + second + " Raids");
                    alreadyRegistered = true;
                }
            }, this);
            if (alreadyRegistered)
                return;
            
            registered = true;
    
            var data = JSON.stringify(message.author.toString());//Make The Data JSON Ready
            fs.appendFileSync("./notify/"+second+".json", data+",", finnished);//Append The Data To The File
            function finnished(err)
            {
                console.log(message.author.toString() + " Has Registered To Be Notified For " + second + " Raids");
            }
            break;
        }
    }
    if (registered)
        message.author.sendMessage("You Have Been Registered To Be Notified Whenever A " + second + " Raid Appears!");
    else 
        message.author.sendMessage("Pokémon Not Found In List Of Raid Bossess");
}
 function notify(name,message){//Notifies The Users Signed Up For Raids Of The Raid
        name = name.replace(" Has Been Found", "");
        name = name.replace("!!A ","");
        //Change This Replace Too^^^

        //Read Notify File For That Boss
        var users_raw = fs.readFileSync("./notify/"+ name +".json", "utf8", function(err,data){
            console.log("Error Reading Notify List \""+name+"\":\n"+data);
            });
        users_raw = users_raw.replace(/\"<@/g,"");//Replace All Instances Of Those Characters
        users_raw = users_raw.replace(/>\"/g,"");
        var list = users_raw.split(",");
        
        //Send All Of The Messages To The Users
        for (var i = 0; i < (list.length - 1);i++)
        {
            var user = client.users.get(list[i].toString());//Make A User Object Using The ID Number
            user.sendMessage("Hey Look!\n" + message.content.toString());//Send Them The Message
        }
 }

client.login(TOKEN);
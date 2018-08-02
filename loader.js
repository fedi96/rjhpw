function getdata(idw) {
  var idd=10;
  var api = "https://hls.rjh.fun/feeds.php?id="+idw+"/"+idd;
  //var api = "soccer.json";
  $.getJSON(api, function (json) {
    if (json.events) {
      var uniquegames = [];
      $.each(json.events, function(i, el){
          if($.inArray(el.event, uniquegames) === -1) uniquegames.push(el.event);
      });
      var games = [];
      $.each(uniquegames,function(i, game){
        var un = [];
      $.each(json.events, function(j, el){
          if(el.event == game) un.push({'id' : j,'lang' : el.audio,'time': el.startDateTime,'sport': el.sport,'league': el.league,'def': el.definition});
      });
      games.push({'game': game,'content' : un});
      });
      $.each(games, function (i, game) {
        var gd = new Date(parseFloat(game.content[0].time)*1000);
        var time = gd.toLocaleTimeString([], {day:'numeric' ,month:'short',hour: '2-digit',minute: '2-digit'});
        var id = game.content[0].id;
        var sport = game.content[0].sport;
        var league = game.content[0].league;
        var title = game.game;
        var gameLinks = '';
        $.each(game.content, function (j, media) {
          if(media.lang.substr(0, 4) != 'Hebr')
          gameLinks = `${gameLinks}<a class="btn btn-sm btn-default float-center" href="play.html?sport=${idw}&id=${media.id}">${media.lang.substr(0, 3)}</a>`;
        });
        var gameTitle = `<div class="card shadow col-lg-3"><div class="card-header">${title}</div><div class="card-body">${time}<br>${league}</div><div class="card-footer">`;
        if(gameLinks != '' && game.content[0].league.indexOf('Israel') ==-1)
        $("#"+sport).append(gameTitle + gameLinks + "</div></div>");
      });
    } else {
      $("#"+sport).append('<div class="tab-content">No games.</div>');
    }
  });
}


function getsports(idw) {
  if(!idw) idw=10;
  var api = "https://hls.rjh.fun/sports.php?id="+idw;
  //var api ="sports.json"
  $.getJSON(api, function (json) {
    if (json.sports) {
      var games = json.sports;
      $.each(games, function (i, game) {
        var id = game.id;
        var sport = game.sport;
        var feeds = game.feedContents;
        if(sport != "Soccer"){
        var game = `<li class="nav-item"><a class="nav-link mb-sm-3 mb-md-0" id="tabs-icons-text-${i}-tab" data-toggle="tab" href="#sport${i}" role="tab" aria-controls="sport${id}" aria-selected="false"><i class="ni ni-cloud-upload-96 mr-2"></i>${sport}</a></li>`;
        var content =`<div class="tab-pane fade"  id="sport${i}" role="tabpanel" aria-labelledby="sport${i}"><div class="tab-content" id="${sport}"></div></div>`;
      }
        $("#tabs-icons-text").append(game);
        $("#myTabContent").append(content);
        getdata(id);
      });
    } else {
      $("#tabs-icons-text").append('<div class="tab-content">No games.</div>');
    }
  });
}
function loadgame(id,sp,y){
  if(!y)y=0;
  var idd=10;
  var api = "https://hls.rjh.fun/feeds.php?id="+sp+"/"+idd;
  //var api = "soccer.json";
  $.getJSON(api, function (json) {
    if (json.events) {
      var game = json.events[id];
      var link = game.links ? game.links[y] : game.codes[y];
      var ifrm = document.getElementById('stream');
      if(game.links)
      ifrm.src = link;
      else
      {
      ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
      ifrm.document.open();
      ifrm.document.write(link);
      ifrm.document.close();}
      var link = game.links ? game.links : game.codes;
      var t = game.links ? "link" : "code" ;
      var links = '';
      $.each(link, function (i, games) {
        var l =`<li class="nav-item"><a onclick="game(${link[i]},${i},${t});" class="link nav-link mb-sm-3 mb-md-0 active show" id="link${i}"><i class="ni ni-cloud-upload-96 mr-2"></i>Link ${i}</a></li>`;
        var h =`<li class="nav-item"><a onclick="game(${link[i]},${i}}=,${t});" class="link nav-link mb-sm-3 mb-md-0" id="link${i}"><i class="ni ni-cloud-upload-96 mr-2"></i>Link ${i}</a></li>`;
        links += y == i ? l : h;
      });
      $("#tabs-icons-text").html(links);
    } else {
      $("#"+sport).append('<div class="tab-content">No games.</div>');
    }
  });
}
function game(i,j,k){
  var link = k == "link" ? "link" : "code";
      var ifrm = document.getElementById('stream');
      if(link == "link")
      ifrm.src = i;
      else
      {
      ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
      ifrm.document.open();
      ifrm.document.write(k);
      ifrm.document.close();
      }
  $(".link").removeClass("active show");
  $("#link"+j).addClass("active show");
}


/*$.each(games, function (i, game) {
  var gd = new Date(parseFloat(game.content[0].time)*1000);
  var time = gd.toLocaleTimeString([], {day:'numeric' ,month:'short',hour: '2-digit',minute: '2-digit'});
  var id = game.content[0].id;
  var sport = game.content[0].sport;
  var league = game.content[0].league;
  var title = game.game;
  var gameLinks = '';
  var gameTitle = `<div class="card shadow col-lg-3"><div class="card-header">${title}</div><div class="card-body">${time}<br>${league}</div><div class="card-footer">`;
  if(gameLinks != '' && game.content[0].league.indexOf('Israel') ==-1)
  $("#"+sport).append(gameTitle + gameLinks + "</div></div>");
});*/
//$("#stream").append(link);

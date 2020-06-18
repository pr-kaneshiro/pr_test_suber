/*
******************************************************************
* MJP common.js
******************************************************************
*/
// UaInfo
var UaInfo = (function(){
	var that = {};
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	that.browser;
	that.os;
	that.ieVr;
	that.interface;

	if(userAgent.indexOf('iphone') > 0 || userAgent.indexOf('ipod') > 0) {
		that.os = 'iPhone';
		that.interface = 'touch';
	}else if(userAgent.indexOf('ipad') > 0) {
		that.os = 'iPad';
		that.interface = 'touch';
	}else if(userAgent.indexOf('android') > 0) {
		if(userAgent.indexOf('mobile') > 0) {
			that.os = 'Android';
		}else{
			that.os = 'AndroidTab';
		}
		that.interface = 'touch';
	}else if(userAgent.match(/mac|ppc/)) {
		that.os = 'mac';
		that.interface = 'mouse';
	}else{
		that.os = 'other';
		that.interface = 'mouse';
	}

	if(userAgent.indexOf('msie') != -1) {
		that.browser = 'ie';
		if(appVersion.indexOf('msie 8.') != -1) {
			that.ieVr = 8;
		}else if(appVersion.indexOf('msie 9.') != -1) {
			that.ieVr = 9;
		}else if(appVersion.indexOf('msie 10.') != -1) {
			that.ieVr = 10;
		}
	}else if(appVersion.indexOf("trident/7.0") > -1) {
		that.browser = 'ie';
		that.ieVr = 11;
	}else if(userAgent.indexOf('chrome') != -1) {
		that.browser = 'chrome';
	}else if(userAgent.indexOf('safari') != -1) {
		that.browser = 'safari';
	}else if(userAgent.indexOf('firefox') != -1) {
		that.browser = 'firefox';
	};
	return that;
})();


// MODAL & MOVIE SETTING
var dataLayer = [];
var MJP = {
	doModal: null,
	scrollBarWidth: 0
};

// MODAL
MJP.doModal = new (function(){
	var that = {};
	that.change = function(_b){
		if (_b) {
			$('html').addClass('Has-modal');
			$('html').css({ marginRight: MJP.scrollBarWidth });
		} else {
			$('html').removeClass('Has-modal');
			$('html').removeAttr('style');
		};
	};
	return that;
});

// MOVIE
MJP.initMovie = function(_obj){
	initModal(_obj.path);
	$.cookie.json = true;
};
function initModal(_path){
	var modal = new (function(){
		var that = {},
			data = [960, 540],
			// data = [200, 300],
			player = null,
			gaId  = '',
			gaUrl = '',
			gaTim = 0,
			gaVol = false,
			callBack = null,
			isOldie = UaInfo.browser == 'ie' && UaInfo.ieVr <= 8,
			hasThis = false,
			cookieId = 'video_volume';

		that.init = function(_str){
			videojs.options.flash.swf = _str + "js/lib/video/video-js.swf";
		};
		that.show = function(_obj){
			if (hasThis) return;
			hasThis = true;
			MJP.doModal.change(true);
			callBack = _obj.callBack;
			var html = '<div id="mdl-box" class="' + (!isOldie ? '' : 'oldie') + '">'
						+ '<div class="mdl-bg"></div>'
						+ '<div class="mdl-sp-outer">'
						+ '<video id="mdl-plr" class="video-js vjs-default-skin" width="' + data[0] + '" height="' + data[1] + '">'
						+ '<source src="' + _obj.video + '" type="video/mp4" />'
						+ '</video>'
						+ '<div class="btn"><a href="#">閉㝘る</a></div>'
						+ '</div>'
						+ '</div>';
			$('body').append(html);
			$('#mdl-box .btn a, #mdl-box .mdl-bg').click(function(e){
				e.preventDefault();
				that.hide();
				$('.promotion-inner').removeClass('js-movie-play');
			});
			gaId  = _obj.gaid;
			gaUrl = _obj.gapath + (!isOldie ? '.mp4' : '.flv');
			gaTim = 0;
			gaVol = false;
			player = videojs('mdl-plr', {
				'controls': true,
				'autoplay': true,
				'nativeControlsForTouch': false
			});
			if (_obj.poster) {
				player.poster(_obj.poster);
			};
			if ($.cookie(cookieId)) {
				var param = $.cookie(cookieId);
				player.volume(param['volume']);
				player.muted(param['muted']);
			};
			player
			.one('play', function(){
				that.callGA('play');
			})
			.on('ended', function(){
				that.callGA('end', gaId, gaUrl);
				gaTim = 0;
				player.one('play', function(){
					that.callGA('play');
				});
				if (_obj.isOne) {
					player.controls = false;
					that.hide();
				};
			})
			.on('volumechange', function(){
				gaVol = true;
				that.setCookie();
			})
			.on('timeupdate', function(){
				var _t = Math.floor(player.currentTime());
				if (_t % 5 == 0 && _t != gaTim) {
					gaTim = _t;
					that.callGA('playing');
				};
			});
			that.callGA('open');
			$('body').mouseup(function(e){
				if (gaVol) {
					gaVol = false;
					that.callGA('volume');
				};
			});
			if (UaInfo.os == 'iPhone' || UaInfo.os == 'iPad') {
				$('.vjs-default-skin .vjs-mute-control').addClass('ios');
				$('.vjs-default-skin .vjs-volume-control').addClass('ios');
				$('.vjs-default-skin .vjs-progress-control').addClass('ios');
			};
		};
		that.hide = function(){
			if (!hasThis) return;
			that.setCookie();
			player.pause();
			$('.vjs-big-play-button').hide();
			$('.vjs-control-bar').hide();
			$('#mdl-box').fadeOut(400, function(e){
				player.dispose();
				player = null;
				$('#mdl-box').remove();
				MJP.doModal.change(false);
				hasThis = false;
				if (callBack) {
					callBack();
					callBack = null;
				};
			});
		};
		that.setCookie = function(){
			$.cookie(cookieId, {
				volume:player.volume(),
				muted: player.muted()
			});
		};
		that.callGA = function(str){
			var action = '',
				label = '';
			switch(str){
				case 'open': action = 'movieOpen'; label = gaUrl; break;
				case 'play': action = 'moviePlay'; label = gaUrl; break;
				case 'playing': action = 'movieView'; label = gaTim; break;
				case 'end': action = 'movieEnd'; label = gaUrl; break;
				case 'volume': action = 'movieVolumeChange'; label = gaUrl; break;
			};
			dataLayer.push({ 'movieCategory': gaId, 'movieAction': action, 'movieLabel': label, 'event': 'movieTrack'});
		};
		that.init(_path);
		return that;
	});
	MJP.movieModal = modal;
};

/*
******************************************************************
* EleSurveillance.js
******************************************************************
*/
$.fn.EleSurveillance = function($user_options){
    var $watch_range    = $(this);//監視対象範囲

    //オプションデフォルト設置
    var $options = {
        callback_class : 'js_SurveEnd',//監視終了時にbodyに付与するclass名
        watch_level    : 10,//監視レベル
        watch_interval : 50,//監視実行間隔
        time_limit     : 5000//制限時間
    };
    $.extend($options,$user_options);

    var watch_num       = 1;//監視回数
    var height_ref_arr  = [];//比較用（前回監視時のimg高さ）
    var height_now_arr  = [];//対象用（今回監視時のimg高さ）
    var exclusIndex_arr = [];//監視除外対象用(index番号が格納される)
    var exclusLog_arr   = [];//読み込み異常有り配列(index番号が格納される)

    var WatchingStart = function(){
        //＜初回監視＞
        if(watch_num == 1){
            //1.img高さ取得,height_ref_arr 配列へ値を挿入
            $watch_range.each(function(){
                var img_height = $(this).height();
                height_ref_arr.push(img_height);
            });
            //2.監視回数を更新
            watch_num++;
        }
        //＜2回目以降の監視＞
        else if(watch_num >= 2){
            var decis_flg  = 0;//処理終了監視用フラグ
            var exclus_flg = 0;//監視除外対象用フラグ

            //1.2回目の監視で処理終了するのを回避
            if(watch_num == 2){
                decis_flg++;
            }
            //2.img高さ取得,height_now_arr 配列へ値を挿入
            $watch_range.each(function(){
                var img_height = $(this).height();
                height_now_arr.push(img_height);
            });

            //3.前回監視時のimg数と同様か確認
            if(height_ref_arr.length == height_now_arr.length){//
                //4.前回監視時の(imgの)高さと比較
                for(var index_1 = 0; index_1 < height_ref_arr.length; index_1++){
                    var ref_value  = height_ref_arr[index_1];//前回監視時の(imgの)高さ
                    var now_value  = height_now_arr[index_1];//今回監視時の(imgの)高さ
                    var this_index = index_1;//現在比較中の(imgの)index番号

                    //5.監視除外対象か確認
                    if(exclusIndex_arr.indexOf(this_index) == -1){
                        //6.前回監視時と高さが異なっているか確認
                        if(ref_value != now_value){
                            decis_flg++;//7.処理終了監視用フラグへ加算
                            exclusLog_arr.push(this_index);//8.読み込み異常有り配列へindex番号を格納

                            //9.読み込み異常有り配列の中に現在比較中の(imgの)index番号があれば監視除外対象用フラグを加算
                            for(var index_3 = 0; index_3 < exclusLog_arr.length; index_3++){
                                var value_3 = exclusLog_arr[index_3];
                                if(value_3 == this_index){
                                    exclus_flg++;
                                }
                            }

                            //10.監視除外対象用フラグが監視レベルを超えた場合の処理
                            if($options.watch_level < exclus_flg){
                                //監視除外対象用の配列に比較中imgのindex番号がなれれば、index番号を監視除外対象用配列へ格納
                                if(exclusIndex_arr.indexOf(this_index) == -1){
                                    exclusIndex_arr.push(this_index);
                                }
                            }

                            exclus_flg = 0;//11.監視除外対象用フラグをリセット
                        }
                    }
                }
            }

            height_ref_arr = [];//12.height_ref_arr 配列の中身を削除

            //13.height_now_arr 配列の中身をheight_ref_arr 配列へ移動
            for(var index_4 = 0; index_4 < height_now_arr.length; index_4++){
                height_ref_arr.push(height_now_arr[index_4]);
            }

            height_now_arr = [];//14.height_now_arr 配列の中身を削除

            watch_num++;//15.監視回数を更新

            //16.処理終了監視用フラグが0であれば処理終了
            if(decis_flg == 0){
                clearInterval(_setInterval);
                SurveillanceEnd();
            }

            //17.制限時間になった場合は処理終了
            if($options.watch_interval*watch_num >$options.time_limit){
                clearInterval(_setInterval);
                SurveillanceEnd();
            }
        }
    };

    var SurveillanceEnd = function(){
        $('body').addClass($options.callback_class);
    };

    var _setInterval = setInterval(WatchingStart, $options.watch_interval);
};
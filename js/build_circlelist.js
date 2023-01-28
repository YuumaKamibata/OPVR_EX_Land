$(document).ready(function(){
    // パスワード要求
    let test = window.prompt('パスワードを入力してください。', '');
    sha_obj.update(test);
    const pswd_hashed = sha_obj.getHash('HEX');
    if(pswd_hashed == hashed) {
        loadData();
    } else {
        alert('パスワードが違います。');
    }
});

function loadData(){
    // JSON読み込み
    $.ajax({
        type: 'GET',
        url: 'https://operationvr.s3.ap-northeast-1.amazonaws.com/json/' + event_id + '/circle.json',
        dataType: 'json',
        async: false
    }).then(
        // 成功
        function(json){
            console.log('読み込みに成功しました');
            buildHtml(json);
        },
        // 失敗
        function(){
            console.log('読み込みに失敗しました。');
        }
    );
}

// JSONを受け取ってHTMLをビルド
function buildHtml(json){
    // すべてのサークルリストの親要素
    let container_circlelist = $('#container_circlelist');
    json.forEach(function(data){
        // ラッパー
        let border_wrapper = $('<div></div', {
            "class": 'col-md-6 border-right border-bottom py-2'
        });
        let row = $('<div></div>', {
            "class": 'row'
        });
        let content_wrapper = $('<div></div>', {
            "class": 'col-sm-6 col-md-9'
        });
        // サークル名
        let head = $('<h4>' + data['booth_row'] + '-' + data['booth_no'] + '&nbsp;' + data['circle_name'] + ' <small>' + data['circle_name_kana'] + '</small>' + '</h4>');
        // タグ（プチ、メインジャンル、撮影レベル等）
        let tag = createTag(data);
        // PR
        let pr = $('<p></p>');
        pr.text(data['pr']);
        // カット
        let cut_wrapper = $('<div></div>', {
            "class": 'col-sm-6 col-md-3'
        });
        let cut_link;
        let cut;
        if(data['cut_flag'] == 1) {
            cut_link = $('<a></a>', {
                href: 'https://operationvr.s3.ap-northeast-1.amazonaws.com/img/' + event_id + '/circle/' + data['circle_entry_no'] + '/cut.jpg',
                "data-toggle": 'lightbox'
            });
            cut = $('<img/>', {
                src: 'https://operationvr.s3.ap-northeast-1.amazonaws.com/img/' + event_id + '/circle/' + data['circle_entry_no'] + '/cut.jpg',
                alt: data['circle_name'],
                "class": 'img-fluid'
            });    
        } else {
            cut_link = $('<a></a>', {
                href: 'https://placehold.jp/512x512.png?text=' + data['circle_name'],
                "data-toggle": 'lightbox'
            });
            cut = $('<img/>', {
                src: 'https://placehold.jp/512x512.png?text=' + data['circle_name'],
                alt: data['circle_name'],
                "class": 'img-fluid'
            });
    
        }
        // TODO：リンク
        let links = createLink(data);
        // 組み立て
        cut.appendTo(cut_link);
        cut_link.appendTo(cut_wrapper);
        links.appendTo(cut_wrapper);
        cut_wrapper.appendTo(row);
        head.appendTo(content_wrapper);
        tag.appendTo(content_wrapper);
        pr.appendTo(content_wrapper);
        content_wrapper.appendTo(row);
        // 親要素に追加
        row.appendTo(border_wrapper);
        border_wrapper.appendTo(container_circlelist);

    });

	// lightboxでサークルカット表示
	$(document).on('click', '[data-toggle="lightbox"]', function(event) {
	    event.preventDefault();
	    $(this).ekkoLightbox();
	});

}

// タグを作る
function createTag(data){
    // プチオンリー
    let petit = $('<span></span>', {
        'class': 'badge badge-info mr-1'
    });
    petit.text('参加プチ名');
    // メインジャンル
    let genre = $('<span></span>', {
        'class': 'badge badge-secondary mr-1'
    });
    genre.text(data['genre']);
    // 撮影レベル
    let photo_level = $('<span></span>');
    if(data['permission'] == 0) {
        photo_level.attr('class', 'badge badge-danger');
    } else {
        photo_level.attr('class', 'badge badge-primary');
    }
    switch(data['permission']){
        case 0:
            photo_level.text('撮影不可');
            break;
        case 1:
            photo_level.text('ブース撮影可');
            break;
        case 2:
            photo_level.text('表紙撮影可');
            break;
        case 9:
            photo_level.text('全撮影可');
            break;
        default:
            photo_level.text('撮影レベル不明');
            break;
    }
    // ラッパーにくるんで返す
    let wrapper = $('<p></p>', {
        'class': 'tag'
    });
    //petit.appendTo(wrapper);
    genre.appendTo(wrapper);
    photo_level.appendTo(wrapper);
    return wrapper;
}

// リンクを作る
function createLink(data) {
    // ラッパー
    let wrapper = $('<p></p>');
    // ショップ
    if(data['shop_url'] != null) {
        let shop_url = data['shop_url'];
        shop_url.replace("\r\n", "\n");
        shop_url.replace("\r", "\n");
        let shops = shop_url.split("\n");
        shops.forEach(function(url){
            let icon = $('<i></i>', {'class': 'fa fa-shopping-cart'});
            let icon_link = $('<a></a>', {
                href: url,
                target: '_blank',
                'class': 'mr-1'
            });
            icon.appendTo(icon_link);
            icon_link.appendTo(wrapper);
        });
    }
    // サイト1
    if(data['site_url1'] != null) {
        let site_url = data['site_url1'];
        site_url.replace("\r\n", "\n");
        site_url.replace("\r", "\n");
        let sites = site_url.split("\n");
        sites.forEach(function(url){
            let icon = $('<i></i>', {'class': 'fa fa-home'});
            let icon_link = $('<a></a>', {
                href: url,
                target: '_blank',
                'class': 'mr-1'
            });
            icon.appendTo(icon_link);
            icon_link.appendTo(wrapper);
        });
    }
    // SNS
    if(data['sns_url'] != null) {
        let sns_url = data['sns_url'];
        sns_url.replace("\r\n", "\n");
        sns_url.replace("\r", "\n");
        let snses = sns_url.split("\n");
        snses.forEach(function(url){
            let icon = $('<i></i>');
            let icon_link = $('<a></a>', {
                target: '_blank',
                'class': 'mr-1'
            });
            if(url.indexOf('twitter.com/') != -1) {
                icon.attr('class', 'fab fa-twitter-square');
                icon_link.attr('href', url);
            } else if(url.indexOf('@') != -1) {
                icon.attr('class', 'fab fa-twitter-square');
                icon_link.attr('href', 'https://twitter.com/' + url);
            } else {
                icon.attr('class', 'fas fa-user-circle');
                icon_link.attr('href', url);
            }
            icon.appendTo(icon_link);
            icon_link.appendTo(wrapper);
        });
    }

    return wrapper;
}

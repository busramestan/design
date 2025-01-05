/*
 * Çalışma yapılacak ortamda jQuery ve AJAX'ın yüklü olup olmadığından emin olmadığım için,
 * jQuery kütüphanesini JavaScript ile dinamik olarak yükledim.
 * Bunun için IIFE (Immediately Invoked Function Expression) kullandım ve bir return değeri ekledim.
 * Return değerini eklememin sebebi, jQuery/AJAX yüklendikten sonra IIFE'nin çalışmasını sağlamaktır.
 * Böylece '$ is not defined' veya '$ is not a function' gibi olası hataların önüne geçilmiş olur.
 */

const script = document.createElement("script");
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
script.type = "text/javascript";

// jQuery yüklendikten sonra carousel'i başlatır
script.onload = function () {
  productsCarousel.init();
};

document.head.appendChild(script);

const productsCarousel = (function () {
  const apiURL =  
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";  // Ürün bilgileri çekilecek API URL

   // Modül başlatma fonksiyonu
  const init = () => {
    if($('.product-detail').length > 0) {  // product-detail classına sahip element yoksa hiç bir şekilde istek atma işlemi yapılmaz.
      buildCSS();
      fetchProducts();
    }
  };

   // Ürün verilerini API'den veya localStorage'dan çeker
  const fetchProducts = () => {
    const storedProducts = localStorage.getItem("products");  // Daha önce kaydedilmiş ürünler var mı kontrol et

    if (storedProducts) {
      const products = JSON.parse(storedProducts);  // LocalStorage'daki ürünleri JSON olarak al
      buildHTML(products);  // HTML yapısını oluştur
      setEvents(products); 
    } else {
      $.ajax({
        url: apiURL,
        method: "GET",
        success: (response) => {
          response = JSON.parse(response).map((item) => ({
            ...item,
            like: false,  // Ürünlerin başlangıçta "like" durumunu false yap
          }));

          localStorage.setItem("products", JSON.stringify(response));  // Ürünleri localStorage'a kaydet
          buildHTML(response);
          setEvents(response); 
        },
        error: (err) => {
          console.error("Veri çekilemedi:", err);
        },
      });
    }
  };

  // HTML yapısını ürün bilgilerine göre oluşturur
  const buildHTML = (products) => {
    let productHTML = `
    <div class="product-carousel">
            <div class="carousel-container">
                <p class="carousel-title ">Benzer Ürünler</p>
                <button class="carousel-btn previous" id="previous">
                    <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14.242"
                height="24.242"
                viewBox="0 0 14.242 24.242"
              >
                <path
                  fill="none"
                  stroke="#333"
                  stroke-linecap="round"
                  stroke-width="3px"
                  d="M2106.842 2395.467l-10 10 10 10"
                  transform="translate(-2094.721 -2393.346)"
                ></path>
              </svg>
                </button> 
                <div class="carousel-track">
        `;

    products.forEach((product) => {
      productHTML += `
                <div class="carousel-item">
                    <a href="${product.url}" target="_blank"> 
                        <img src="${product.img}" alt="${product.name}">
                    </a>
                    <div class="like-button" data-id="${product.id}">
                       <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20.576" height="19.483" 
                        viewBox="0 0 20.576 19.483"
                        >
                       <path 
                        fill="none" 
                        stroke="#555" 
                        stroke-width="1.5px" 
                        d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" 
                        transform="translate(.756 -1.076)"
                        ></path>
                       </svg>
                    </div>

                    <div class="carousel-subcontent">
                        <a href="${product.url}" target="_blank">
                            <p class="product-name">${product.name}</p>
                        </a>
                        <p class="product-price">${product.price} TL</p>
                    </div>
                </div>
            `;
    });

    productHTML += `
            </div>
                <button class="carousel-btn next rotate-180" id="next">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14.242"
                height="24.242"
                viewBox="0 0 14.242 24.242"
              >
                <path
                  fill="none"
                  stroke="#333"
                  stroke-linecap="round"
                  stroke-width="3px"
                  d="M2106.842 2395.467l-10 10 10 10"
                  transform="translate(-2094.721 -2393.346)"
                ></path>
              </svg>
                </button>
            </div>
        </div>
        `;

    $(".product-detail").after(productHTML);  // "product-detail" classına sahip element den sonra carousel'i ekle

  };

  const buildCSS = () => {
    const css = `
            .product-carousel {
                background-color: #FAF9F7;
                font-family: "Open Sans", serif;
                display: flex;
                justify-content: center;
            }
            .carousel-title {
                font-size: 32px;
                color: #29323b;
                line-height: 33px;
                font-weight: lighter;
                padding: 15px 0;
                margin: 0;
            }
            .carousel-container {
                display: block;
                width: 80%;
                justify-content: center;
                position: relative;
            }
            .carousel-track {
                display: flex;
                overflow-x: scroll;
                scroll-behavior: smooth;
                scrollbar-width: none;
            }
            .carousel-item {
                flex: 0 0 210px;
                margin: 10px;
                background: #fff;
                position:relative;
            }
            .carousel-item img {
                width: 100%;
            }
            .like-button {
                cursor: pointer;
                position: absolute;
                top: 9px;
                right: 15px;
                width: 34px;
                height: 34px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
                border: solid .5px #b6b7b9;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .carousel-subcontent {
                display: flex;
                flex-direction: column;
                padding: 0 10px;
            }
            .carousel-subcontent a {
                text-decoration: none;
            }
            .product-name {
                font-size: 14px;
                color:#302e2b;
                width: 200px; 
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .product-price {
                color: #193db0;
                font-size: 18px;
                font-weight: 600;
            }
            .carousel-btn {
                cursor: pointer;
                background: none;
                border: none;
                position: absolute;
                top: 50%;
            }
            .next {
                right: -35px;
            }
            .previous {
                left: -35px;
            }
            .rotate-180 {
                transform: rotate(180deg);
            }

            @media (max-width: 768px) {
                // .carousel-btn {
                //     display: none; 
                // }
                .carousel-container {
                    width: 85%;
                }
                .carousel-item {
                flex: 0 0 280px;
                }
            }
        `;

    $("<style>").html(css).appendTo("head");  // CSS'i head'e ekle
  };

  // Olay dinleyicilerini ayarlar (butonlar, like işlemleri vb.)
  const setEvents = (products) => {
    let marginLeftWidth = parseInt($(".carousel-item").css("marginLeft"));  // Ürün kenar boşluklarını al
    let marginRightWidth = parseInt($(".carousel-item").css("marginRight"));
    let itemWidth = parseInt($(".carousel-item").width());  // carousel-item genişlik değerini tutar

    let spaceScroll = marginLeftWidth + marginRightWidth + itemWidth;  // Kaydırma mesafesini hesaplar

    $("#previous").on("click", () => {
      $(".carousel-track").scrollLeft(
        $(".carousel-track").scrollLeft() - spaceScroll // Sola kaydır  
      );
    });

    $("#next").on("click", () => {
      $(".carousel-track").scrollLeft(
        $(".carousel-track").scrollLeft() + spaceScroll  //Sağa kaydır
      );
    });

    // Sayfa yüklendiğinde, bütün like buttonlarını gez, ürünlerin like durumunu kontrol et ve UI'yi güncelle
    $(".like-button").each(function () {
      let currentButton = $(this);
      let { product, icon } = getProduct(currentButton, products);

      // Eğer ürün favoriye eklenmişse, kalp iconunu mavi yapar
      if (product && product.like === true) {
        updateLikeButtonColor(icon);
      }
    });

    // Like butonuna tıklama olayını dinle
    $(".like-button").on("click", function () {
      let currentButton = $(this);
      let { product, icon } = getProduct(currentButton, products);

      if (product) {
        product.like = !product.like;  // Like durumunu tersine çevir  
        localStorage.setItem("products", JSON.stringify(products));  // localStorage'ı güncelle

        updateLikeButtonColor(icon);  // Butonun rengini güncelle 
      }
    });
  };

   // Buton ile ilgili ürünü bulur
  const getProduct = (button, products) => {
    let productId = button.data("id");
    let icon = button.find("svg path");
    let product = products.find((product) => product.id === productId);
    return { product, icon };
  };

  // Like butonunun rengini günceller
  const updateLikeButtonColor = (icon) => {
    if (icon.attr("fill") === "#193db0") {
      icon.attr({
        fill: "none",
        stroke: "#555",
      });
    } else {
      icon.attr({
        fill: "#193db0",
        stroke: "#193db0",
      });
    }
  };

  return {
    // Modülü başlatan ana fonksiyon
    init: function () {
      init();
    },
  };
})();

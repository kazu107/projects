const fs = require('fs');
const path = require('path');

const largeInput4 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-test4.txt'), 'utf8');
const largeInput5 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-test5.txt'), 'utf8');
const largeInput6 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-test6.txt'), 'utf8');
const largeInput7 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-test7.txt'), 'utf8');
const largeInput8 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-test8.txt'), 'utf8');
const largeInput9 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-test9.txt'), 'utf8');
const largeInputX = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-6', 'p1-6-testX.txt'), 'utf8');



module.exports = {
    judge: "normal",
    sample1: {
        input: '5\n' +
            '159 162 165 169 173',
        output: 'Yes\n',
    },
    sample2: {
        input: '3\n' +
            '150 160 155',
        output: 'No\n',
    },
    test1: {
        input: '5\n' +
            '2 2 2 2 2',
        output: 'Yes\n',
    },
    test2: {
        input: '1000\n' +
            '746247619 996575458 416837155 21124727 393556056 210712835 130485695 186806072 111540076 146738515 46141230 958265770 980909231 368207862 648106256 325322796 607110426 720913338 432338097 251341123 140830699 625698496 802045360 468523709 948424096 85637955 233900647 481648338 849231360 11104734 613780668 816534040 368696568 232407107 415594887 841526508 876851728 743049563 610742516 80244370 172960705 12127292 5336677 668021951 802728865 535690231 498688961 5405727 657109313 786532439 54316255 362129953 282020680 41616887 939086270 444678100 245628194 31137916 231982749 982944015 828314216 892971620 741408695 529767106 294300458 988978736 742202118 954421262 850810904 796500301 845464440 733132103 642406792 974784013 827569016 230855603 247049809 387410083 418449234 334925270 406850183 90529239 755729709 383476179 529269882 594560079 457490615 838491670 358348013 864591349 892930738 175279606 985207548 448228738 749711919 982754194 876197942 754890176 517993954 129790969 982789713 940956543 364626918 39768620 906821301 426354490 757215043 287188375 810127134 438244259 493001724 579077143 511456322 70107002 26541952 380179327 978929705 657484611 644812830 700989888 235555604 559116359 86334050 698192913 249751616 640429136 343631043 826849799 285769942 721892581 343752834 445830822 473191668 52497445 237722115 494664488 953310482 460248051 132655430 914851628 982158876 986205555 888479115 623038931 318784517 681130992 180192557 395486641 288538094 741388526 805261991 763717301 142144020 248602434 477195792 924978915 608664158 742177604 71711180 954616234 985191910 814994839 78627860 597638723 510534572 991560372 128044799 529191002 987259663 276384815 799606913 768387031 414964689 869304550 182731308 24511187 387352919 16051907 200613419 35451848 162321028 816365017 855242932 831688554 138741863 716610350 595170643 545674692 356481163 290748017 939472349 489124838 582770701 8968689 804971784 354699288 379533461 635353850 378825555 753764182 509184070 431024049 590299727 997859114 934963639 247949315 112490091 586877463 668285519 631309823 503335140 645638180 292091541 7599108 891483868 418659084 812911832 406336702 135289611 844260478 773827075 545317336 464598293 186478383 692167896 683629196 3722667 877008611 8587839 873415931 437079469 742598238 984333640 494823662 859533543 947776739 518873135 380743562 720708284 101286844 5141953 719168878 229802842 635450522 715329916 183779473 523757179 632002057 324174925 968889036 967531536 28618964 531998031 633047871 877080674 831619791 759636088 697114325 608717968 213894367 220059904 179648774 427997235 615405829 606347054 919461632 762267488 998221237 154432602 761669914 971152324 963718723 547469171 140087293 614918802 326252015 276290082 602686680 617567775 247027217 245804860 427572487 341186679 101223111 995291797 917571847 44368372 398521140 874139058 129704987 215667032 485652900 596320584 378444134 748478715 648449111 810572208 56432181 441459347 819497862 743754847 940145843 639633124 95375277 474983976 936750663 740383414 235057532 238802640 569044087 216184384 513019433 125520571 269866896 256190218 745958746 354878393 467255228 63970689 416261115 136055622 25242175 390603447 910330906 939907423 264533435 320718751 498334863 910306904 31039797 563697048 990157590 599685377 687849397 271750192 394266916 229943599 678532657 220742825 371560931 142145048 188801569 103850597 932633664 486683311 444986326 432046650 494058508 382675725 633616546 372976633 567732563 219691815 601784886 53070565 793108092 665684332 461800502 117295115 886883572 471936392 850824524 466684598 691277053 392821848 151119137 272547059 1885505 899152802 510750184 134841719 18593143 966074648 478317335 977681684 618848436 302862327 79068338 497582705 149540609 539549767 353797551 813852377 985158176 484531840 996395166 928530352 503908288 389394813 711964170 518751492 375977161 765234179 323163210 622661117 317703067 819923017 360706508 372166154 735648201 982108709 259797526 209973737 596117980 627781623 768621158 912719738 414910669 204213944 834726754 102249763 347034486 277614507 138778364 564469036 75414601 786784780 531818655 396128 531059453 471008810 400658039 960659968 406088680 102923894 673168477 275863529 358708270 76218636 83093997 528172735 251118003 335165343 871555107 508924160 790793545 907265385 910551624 354314943 693408181 670985945 730604414 508294929 860667905 358752120 270806097 816863415 444935720 473559414 34311226 706055201 803638387 889140683 250399128 357404368 478378719 267021308 263878539 253963370 866750581 797507642 102665708 809336329 12278373 197079575 169033842 253510512 403032665 990144933 634818824 716785994 906916266 955054449 845991727 843157058 247413147 527027289 120391105 686990404 390129141 303801225 639971106 735440171 492240146 916438307 744473011 758291413 64507643 582949140 135088677 171245248 540114407 168100938 758931488 694153 93444447 580605 537457717 186230131 12003277 601013855 186605713 20724261 977257671 505956468 944947669 166357425 413337457 657385357 826428305 724684465 433638171 302014232 927488773 272519115 222283287 999651638 19862662 857734254 111585481 198064325 213507840 37002686 685289686 205446833 733739215 654770232 55237721 589017264 595518384 841157200 359439344 259634571 717208739 339151147 885585346 32998475 114742369 15646663 965325025 66386752 476653585 940536589 696012983 345674127 523198024 143196233 998342509 352745071 763325160 119171442 576426029 494573239 424035981 207918445 516109593 9117411 867557221 45757208 799420854 685664642 553443116 378383028 670713256 605121112 776113139 82141390 438033412 163019122 685673823 499757323 755921339 8399650 311938423 524362985 81402928 238511549 604490569 777692392 662315044 815733112 997231651 327466252 977229259 520983330 554613410 64136835 288267835 708880986 699852358 613296345 818911688 23624259 290664838 48186093 185078427 632776624 919954695 956381296 484980318 714866732 480270280 680589079 284347737 604001054 106978866 217594768 42626987 676959986 17709512 243654615 196054296 9165088 533465962 862926146 286468495 998210229 107108081 279081097 341251935 766296549 448416028 803561909 79139616 735607986 911309427 833570996 544888377 945276882 163135927 656514295 181533933 455034583 99598092 889915467 917113969 132156453 985154351 240237456 650687723 564372497 869415190 321929102 950891645 909782516 305242411 310179292 954891563 216022491 59640354 920814925 823657325 187646400 535170484 970881594 51969903 293174777 619668608 14307753 646583156 615302401 147881814 867318970 24243918 292937698 34489528 544991679 456063537 745775365 1076064 463475071 219276735 364412997 532634430 905137825 942705688 311233941 411637277 846690517 600889632 881734504 519476945 274481799 613170436 981815203 325202157 616791292 225965189 500377541 51863195 588488498 721635847 412920612 512816674 754985002 555485862 426721598 468637086 579643687 380933981 221517911 450769581 468822935 452957727 864256681 844115345 347988247 267301245 42145999 669070994 956882124 104129313 429726354 534149667 848650564 227785709 342676262 890301800 541294259 941028752 936853115 132388693 157499455 79626741 287457332 867576351 287423885 632099806 394981588 942353631 465953587 222126283 223974412 157215247 450127056 686417314 313059825 118654829 93147713 685721472 26504250 152123726 749893863 852300455 822217031 7544345 244542932 664808899 17910916 263821606 335458683 133173684 407080005 10877680 918730594 392148444 726699929 906022280 266739174 857156693 22334940 111335875 238507924 531272864 838751932 549300120 3913245 11246459 446518431 530645510 618495169 167793041 655225672 696027112 588519964 645334140 436177250 38251252 257326742 757767107 87241239 868780078 168659790 267760648 249552735 567053572 536086002 580265642 992062766 670199035 386399817 472661426 684283088 692369701 832713645 477055302 455718902 13111148 281620661 55252281 48817395 486060601 475391426 84693365 323407147 591891040 248772340 743182987 4073074 764001437 234573090 629525500 937543544 484509338 441175855 653499244 727921342 809344248 874594479 500386616 466643168 20815516 409126685 331097078 102441594 989793750 565288859 812167552 269094611 565347281 711793011 75873326 472700254 218611682 386789981 898816154 294137836 537308186 750800069 304743633 366441488 951387003 586606397 674495316 5334267 264813364 560441589 184344987 415439026 425623192 715718664 963521557 371040819 806069153 711021131 376142448 58844124 955473766 911022557 125805437 401375340 770456376 601879091 414989742 981128474 575910344 538661188 468207371 41429701 302317130 413697979 259381269 923694521 548629680 963219914 968250339 926250592 925470331 536870888 2253296 90491842 511829700 607075282 69166526 735202422 556739832 713757967 26847396 282027320 349844994 399099062 115268432 297351340 960112364 855477802 731150223 409196879 509055096 635717279 509107016 9377468 231524609 627686533 920829258 642332835 887513820 204885560 841924082 593993392 710731059 644792791 9937404 421938488 947970316 951643375 463956304 690532651 615972554 809478960 402963604 986899433 219839643 480816766 733891350 612431678 66817771 937399217 336708525 560195470 359119439 766129407 954355957 945724862 366953106 725707489 317950704 909283414 555918535 170557586 757860957 852540854 396690756 293950700 846529247 943715203 151523279 989252789 166173141 502517479 752177565 801998090 858698406 317084268 716061501 455790936 906354734 585516542 885864602 244284989 898946580 620407642 568867332 702129287 289507503 843259760 258473769 184283397 871790815 347894028 668259004 867724407 517669389 539602298 90648824 930479364 101286565 778898779 762025103 965565598 755060253 30434269 101852998 591673282 173189294 504444744 897741788 793258932 858803865 69428831 596188052 920868233 424398294 466318604 996798818 543247204 556119911 22501786 683925810 291988899 246443417',
        output: 'No',
    },
    test3: {
        input: '1000\n' +
            '549958824 734492818 103106604 571272036 499428700 935530561 912148152 337313149 541935311 463616248 356897538 734612085 312091825 659944900 205535700 190757740 17737950 482555094 977487695 958721712 868011296 522978912 391699884 555704415 443642666 844072880 245334386 6750360 42712460 522863974 844040813 496029667 798036887 871855926 948162632 847319880 811477384 386489821 563943990 883458915 228154908 412918179 152225264 311776133 339095606 943581576 350275346 238010164 877150855 687269396 751083727 560553462 857047359 706287822 390928061 144792868 71299845 78209258 387559778 668798645 803260918 68182036 354598856 350604007 548001044 878738016 170000811 732665611 852718648 549676299 742649511 547715489 388786912 976316016 285320715 808545520 642281687 863508685 769821419 845327023 66857256 803116092 730985030 353624903 808408779 872356715 689496590 698766256 244422359 105627884 720439979 590389594 245970797 568967531 118585318 812470591 375037217 946857949 481283735 234318816 1598697 966564559 43887047 623306700 182639078 107590894 736279398 519041977 524832993 416706656 172429373 639185791 206073029 382132483 891261825 61011961 972824721 213415709 997004438 466806298 165028498 549241527 210517360 953368653 825588550 71154486 472803285 239589573 676555804 496944547 850576543 255506806 867800274 586645646 882307164 433410159 818341308 158861849 597156980 460772643 776766484 99791841 20238379 744162584 839011551 993427570 151833826 680539573 322918285 519781661 525094223 170416055 389932761 691146246 322396523 516148763 411146426 333135031 832861672 106555322 669165646 160917755 426309403 153967823 201369022 975808369 545728159 443013194 890241277 197697177 407229940 9127304 38020496 815083782 115577421 909668546 975683188 459312499 474296929 356358322 49037840 963995676 956055046 316337393 817249381 809359062 275278669 640720387 47263546 632487759 200014995 603162238 269970508 673550924 7358133 867417985 952320065 557533191 437638278 351099576 869592881 155755063 195090707 561929922 524262426 616156060 497987526 263479626 664569207 426528591 606659198 783683292 780302632 681316525 329275117 853932 792611547 706679504 990887409 903636860 48325522 368092481 28480895 944514370 623189431 269594153 834736457 125284979 645511 109998361 634396469 226206217 987900390 37810398 827752311 385759915 211360886 132842279 547584446 541059783 53920908 403174160 555259841 433722955 858766547 77067093 278746860 67607906 277700097 401550149 458331026 963095281 209143080 389950318 502293665 689053467 969088458 493438939 830632658 132279724 40029661 295153006 95608554 535557411 510959778 819497382 915253719 718173209 65780591 797813757 284937054 258337528 737949655 318347191 262294956 448768376 136318926 558761291 396023222 54779280 987515341 705702023 257704726 259801593 984846549 745169130 12431670 729871562 332783354 760448139 330847845 772094091 478442200 353159882 365214255 673407527 188487061 501344371 166523408 228730457 902796095 204669418 281254019 233335029 783848874 507420304 475357966 378858981 401035205 818946466 125475095 79239845 452300946 706374726 889527731 818715312 340793821 24046513 881331242 216556934 490341182 765559361 485095419 982304979 816306119 914030889 983160934 954273939 274868378 919929446 87452309 149003880 940189917 644656708 503717428 812976409 716194996 90084479 358823584 628236202 443392633 570006139 968920023 138631635 694929269 240108779 181014129 391387746 847228059 434277013 881226661 30063499 495586781 712297843 169821601 518414586 585273588 497559214 205660438 905429779 259483848 881001778 802245130 710226740 582769520 120076277 377912573 8637849 243297040 805450567 448471287 105787851 139609154 810002032 867965017 847573901 740051544 338653689 441935591 867750532 32718943 288415104 807236605 711811980 843698255 376651895 334585737 818025532 934387647 617604323 56584061 324162126 46672874 67673080 972789279 585631479 247848472 655070635 635500859 301645108 695540381 934167321 528034669 820310475 25862337 651494272 434610385 112501681 356672811 795223013 648363446 701744659 242443928 68886417 551378921 81845221 26462549 728244893 556256443 100544714 487344459 167786791 485381589 643975751 33618774 221518052 154839016 535655610 88022405 125133746 795655359 236214812 173148261 586532481 716459986 139657195 987993221 167023064 252336969 617396639 661405219 298988999 361605015 337205395 238340222 845487871 921369656 232858996 292867094 108085705 537072053 397876972 862785041 981020055 160981630 196986084 339420833 896497119 831737028 687278273 483436102 124581034 905448869 909953208 765982575 917308653 510894623 860627736 734504135 374459694 946599879 260086400 647875563 805129415 184140696 733080817 596472197 671866321 711010903 958341807 803770377 654297216 780739364 982933772 176023965 574174443 800278151 742629706 275545771 860627532 207702509 941728672 127020176 710623734 531438935 930607103 132951490 174367668 701227344 352820871 793445683 189034266 140317675 244002747 541100734 694372167 134902560 32265189 919914692 656970249 800839258 388648935 727293064 690875459 68380154 748429072 121533651 795136170 352749289 915130660 29306631 7085928 320473361 884151378 720797901 201581882 392359817 464255189 596828217 459655557 739793652 51547421 694475671 135915661 439242352 764607543 485399010 411509276 245220380 298706913 819395148 262106812 106662781 408916205 390640152 603784578 950546926 207596940 990084266 538848017 286182223 637823346 482180883 127755096 924093864 650804290 294029117 424957946 24212613 665363113 760177495 354869433 811855749 208343800 907583642 639846403 692134009 883343814 482359243 434179636 899116732 864934246 329924651 945793942 738418475 392576656 794126488 406492203 655869100 875153708 287841222 560760778 479422618 878010587 164040925 71164745 435657884 57129439 21804407 277385769 341170292 678052493 572856318 758566605 665751044 864004510 470120401 832380683 35147557 166946496 364759420 632290427 979783354 343174424 40605713 385114001 338061335 634255076 58370243 957019442 706848186 676939650 483986248 431367306 659588843 192693422 161305197 301630404 175039042 773557075 576917199 281161756 175791229 543410664 2275507 375349894 679655272 140563859 246895599 12198074 629097671 844000840 950046732 297784050 668005462 151211373 108932145 733068085 384530577 690848434 745804555 958125905 123587416 205350553 916343721 735021459 904639286 61933828 919966871 731293932 564592445 833386189 186824047 387025073 772898464 112781459 318484987 594014442 202817938 358114471 314288427 944006711 978945072 698563396 555418940 302930300 234679945 963943200 378728507 721792703 264335489 270538323 410550910 890808737 756130190 347988383 998705235 348707001 552545021 425577694 552158009 405990715 191898238 94698514 936733510 14069356 768812629 228824749 173593687 103188412 48999746 932565511 421583218 38426202 802209300 739703835 331018826 451764424 772691435 617795722 878861045 120686455 789865109 561544729 808770852 900671277 101159878 182707171 762330926 996179657 543284256 331123025 628117967 795179964 887620625 797976392 309422259 976968489 96500394 872044749 799868947 458849674 460773325 721411002 954444428 246741205 313191008 26107793 51143498 936107568 160824801 314233436 722820936 320740172 61828224 465706136 608528242 338085073 543019149 537276341 756558013 60483007 876627888 435974380 177768624 948347213 212914857 778297694 1547165 92771076 89658539 660793537 57148904 771811488 478909162 244314666 374433022 162324523 458823276 371923801 279824546 474897678 514135963 916142626 534708870 696250729 787089725 335768423 616592536 128509271 200260642 92606984 433846096 323817440 405542684 131893870 282454918 617572473 382844895 933001444 69138824 982951353 286916962 791647509 554938991 611553480 790702511 787501683 203390275 830264949 800491146 908038236 252567148 690767903 323775108 520168658 805275661 104961939 859816656 989482709 826044982 311691989 62624245 447436343 179718087 622146346 800945548 38543718 632062584 981808518 223835021 860530727 917453273 568693873 588125264 895899856 624939289 289206346 392519514 829929550 550582213 583150955 967515929 663970559 376804019 52245965 480298129 703245393 132030355 526412749 959471544 73895200 175286621 697792713 700976620 507506402 336475946 187192832 449484192 863158411 400294379 584447944 16891004 674936538 860464696 75145566 511698622 497356879 707311026 38146628 617438773 615749465 697637229 508955199 906523059 717162575 169791162 60180935 506272068 112873252 101849702 398460745 977685576 330608203 115660258 899715531 183484505 894111075 951621689 695166275 755024374 802162920 800463355 823251099 910327859 792665203 41169064 350940654 661679115 986102887 416900797 324277519 960317973 712661842 313717743 387193042 627384237 527053434 279847742 196523322 495615552 817926351 829638812 31957834 845532986 606611548 692103327 32291442 322995782 406211992 568106099 398950397 411633859 940370471 188233112 240195398 47939205 933523886 907198467 633825913 731185103 211498034 112138728 691188183 518774398 700509126 114062233 999848453 102150080 508996850 318226721 593161926 723890713 61449241 869451073 760737090 49776561 712976562 925045282 58499581 761617895 382961914 206761148 773107103 763039387 758500638 429610640 52170006 405988639 449921039 955782343 365376572 663282238 480654613 1711479 733135217 964264395 317599322 982558241 378648274 348111479 314223890 179411974 126307923 175556392 828534812 223536679 594190948 118711447 700981582 823556566 573077138 499667883 219272103 632187821 20568297 367751819 686108507 368963834 190129708 846736184 359422852 958705873 889298465 865131038 123508823 912250490 46619247 845750427 762286361 932404761 959458701 177145029 646214609 977287741 472269515 179276725 922626894 392715928 171440539 189236846 825117486 981006996 348005190 814836107 902977883 178832400 365138840 548880306 563041423',
        output: 'No',
    },
    test4: {
        input: largeInput4,
        output: 'No',
    },
    test5: {
        input: largeInput5,
        output: 'No',
    },
    test6: {
        input: largeInput6,
        output: 'No',
    },
    test7: {
        input: largeInput7,
        output: 'Yes',
    },
    test8: {
        input: largeInput8,
        output: 'Yes',
    },
    test9: {
        input: largeInput9,
        output: 'Yes',
    },
    testX: {
        input: largeInputX,
        output: 'Yes',
    },
}
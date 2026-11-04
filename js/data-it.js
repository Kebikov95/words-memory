// Данные готовых наборов слов: итальянский.
// Формат строки слов:
//   слово|транскрипция (МФА)|перевод|пример на языке набора|пример на втором языке|перевод примера на русский
// Примеры необязательны; у пословиц их нет — карточка сама является фразой.
// Уровень примеров A1–A2; языковая пара примеров — взаимные переводы.
// Метаданные группы: id, name, icon, tag, desc, size?; lang добавляет загрузчик (groups-data.js).
window.WM = window.WM || {};

(() => {
// частотное ядро (300 слов) — основа набора «300 самых частотных слов»
const CORE_TOP = `
e|e|и|Marco e Luca sono amici.|Marco and Luca are friends.|Марко и Лука — друзья.
o|ɔ|или|Vuoi tè o caffè?|Do you want tea or coffee?|Хочешь чай или кофе?
ma|ma|но|Voglio venire, ma sono stanco.|I want to come, but I am tired.|Я хочу прийти, но я устал.
se|se| если|Se piove, resto a casa.|If it rains, I stay home.|Если идёт дождь, я остаюсь дома.
che|ke| что|Questo è il libro che cerco.|This is the book that I am looking for.|Это книга, которую я ищу.
come|ˈkome|как|Come stai?|How are you?|Как ты?
quando|ˈkwando|когда|Quando inizia il film?|When does the film start?|Когда начинается фильм?
dove|ˈdɔːve|где, куда|Dove abiti?|Where do you live?|Где ты живёшь?
perché|perˈke| почему|Perché studi l'italiano?|Why do you study Italian?|Почему ты учишь итальянский?
non|nɔn|не|Non lo capisco.|I don't understand it.|Я не понимаю этого.
sì|si|да|Sì, hai ragione.|Yes, you are right.|Да, ты прав.
no|nɔ|нет|No, grazie.|No, thanks.|Нет, спасибо.
grazie|ˈɡrattsje|спасибо|Grazie per il tuo aiuto!|Thank you for your help!|Спасибо за твою помощь!
ciao|tʃao|привет, пока|Ciao, come va?|Hi, how are you?|Привет, как дела?
buongiorno|bwonˈdʒorno|добрый день|Buongiorno, dottore!|Good morning, doctor!|Добрый день, доктор!
arrivederci|arriveˈdertʃi|до свидания|Arrivederci e grazie!|Goodbye and thank you!|До свидания и спасибо!
scusi|ˈskuːzi|извините|Scusi, dov'è la stazione?|Excuse me, where is the station?|Извините, где вокзал?
io|ˈiːo|я|Io lavoro, tu studi.|I work, you study.|Я работаю, ты учишься.
tu|tu| ты|E tu, come stai?|And you, how are you?|А ты как?
lui|lui|он|Lui è mio fratello.|He is my brother.|Он мой брат.
lei|lɛi| она|Lei è mia sorella.|She is my sister.|Она моя сестра.
noi|nɔi|мы|Noi abitiamo a Milano.|We live in Milan.|Мы живём в Милане.
voi|vɔi|вы|Voi dove andate?|Where are you going?|Куда вы идёте?
loro|ˈlɔːro|они|Loro non parlano italiano.|They don't speak Italian.|Они не говорят по-итальянски.
questo|ˈkwesto|это, этот|Questo libro è interessante.|This book is interesting.|Эта книга интересная.
quello|ˈkwɛllo| тот|Quella casa è vecchia.|That house is old.|Тот дом старый.
qui|kwi|здесь|Vieni qui, per favore.|Come here, please.|Иди сюда, пожалуйста.
lì|li|там|I libri sono lì, sul tavolo.|The books are there, on the table.|Книги там, на столе.
ora|ˈɔːra|сейчас, час|Che ora è?|What time is it?|Который час?
oggi|ˈɔddʒi|сегодня|Oggi resto a casa.|Today I am staying home.|Сегодня я остаюсь дома.
ieri|ˈjɛːri|вчера|Ieri ho visto Marco.|I saw Marco yesterday.|Вчера я видел Марко.
domani|doˈmaːni|завтра|Domani vado al mare.|Tomorrow I am going to the sea.|Завтра я еду на море.
sempre|ˈsɛmpre|всегда|Marco è sempre in ritardo.|Marco is always late.|Марко всегда опаздывает.
mai|mai|никогда|Non mangio mai la carne.|I never eat meat.|Я никогда не ем мясо.
spesso|ˈspɛsso|часто|Spesso vado a piedi al lavoro.|I often walk to work.|Я часто хожу на работу пешком.
molto|ˈmolto| много|Sei molto gentile!|You are very kind!|Ты очень добрый!
poco|ˈpɔːko| мало|Ho poco tempo oggi.|I have little time today.|У меня мало времени сегодня.
tutto|ˈtutto|всё, весь|Tutto va bene.|Everything is fine.|Всё хорошо.
niente|ˈnjɛnte|ничего|Non capisco niente!|I don't understand anything!|Я ничего не понимаю!
qualcosa|kwalˈkoːza|что-то|Voglio dirti qualcosa.|I want to tell you something.|Я хочу тебе кое-что сказать.
qualcuno|kwalˈkuːno|кто-то|C'è qualcuno alla porta.|There is someone at the door.|У двери кто-то есть.
uno|ˈuːno|один|Ho uno zaino nuovo.|I have a new backpack.|У меня новый рюкзак.
due|ˈduːe|два|Ho due gatti.|I have two cats.|У меня два кота.
tre|tre|три|Il treno parte alle tre.|The train leaves at three.|Поезд отправляется в три.
casa|ˈkaːza|дом|Torno a casa presto.|I am coming home early.|Я приду домой рано.
acqua|ˈakkwa|вода|Bevo molta acqua.|I drink a lot of water.|Я пью много воды.
giorno|ˈdʒorno|день|Che giorno è oggi?|What day is it today?|Какой сегодня день?
notte|ˈnɔtte|ночь|La notte dormo bene.|At night I sleep well.|Ночью я сплю хорошо.
sera|ˈseːra|вечер|La sera guardo la TV.|In the evening I watch TV.|Вечером я смотрю телевизор.
mattina|matˈtiːna|утро|La mattina bevo un caffè.|In the morning I drink a coffee.|Утром я пью кофе.
anno|ˈanno|год|Buon anno nuovo!|Happy New Year!|С Новым годом!
mese|ˈmeːze|месяц|Questo mese lavoro molto.|This month I am working a lot.|В этом месяце я много работаю.
settimana|settiˈmaːna|неделя|Ti vedo la prossima settimana.|I'll see you next week.|Увидимся на следующей неделе.
tempo|ˈtempo| время|Non ho tempo adesso.|I don't have time now.|У меня сейчас нет времени.
strada|ˈstraːda|дорога, улица|Questa strada è molto trafficata.|This road is very busy.|Эта дорога очень оживлённая.
città|tʃitˈta|город|Roma è una città bellissima.|Rome is a very beautiful city.|Рим — очень красивый город.
uomo|ˈwɔːmo|мужчина, человек|Quell'uomo è mio padre.|That man is my father.|Тот мужчина — мой отец.
donna|ˈdɔnna|женщина|Quella donna è la mia professoressa.|That woman is my teacher.|Та женщина — моя преподавательница.
bambino|bamˈbiːno|ребёнок|Il bambino gioca nel parco.|The child is playing in the park.|Ребёнок играет в парке.
amico|aˈmiːko|друг|Marco è il mio migliore amico.|Marco is my best friend.|Марко — мой лучший друг.
madre|ˈmaːdre|мама, мать|Mia madre cucina benissimo.|My mother cooks very well.|Моя мама готовит очень хорошо.
padre|ˈpaːdre|папа, отец|Mio padre lavora in banca.|My father works in a bank.|Мой папа работает в банке.
mano|ˈmaːno|рука|Scrivo con la mano destra.|I write with my right hand.|Я пишу правой рукой.
occhio|ˈɔkkjo|глаз|Ho qualcosa nell'occhio.|I have something in my eye.|У меня что-то в глазу.
testa|ˈtɛsta|голова|Mi fa male la testa.|My head hurts.|У меня болит голова.
cibo|ˈtʃiːbo|еда|Il cibo italiano è delizioso.|Italian food is delicious.|Итальянская еда очень вкусная.
pane|ˈpaːne|хлеб|Compro il pane ogni mattina.|I buy bread every morning.|Я покупаю хлеб каждое утро.
vino|ˈviːno|вино|Questo vino è molto buono.|This wine is very good.|Это вино очень хорошее.
caffè|kafˈfɛ|кофе|Vuoi un caffè?|Do you want a coffee?|Хочешь кофе?
soldi|ˈsɔldi|деньги|Non ho soldi con me.|I don't have money with me.|У меня нет с собой денег.
lavoro|laˈvoːro|работа|Il mio lavoro è interessante.|My job is interesting.|Моя работа интересная.
scuola|ˈskwɔːla|школа|I miei figli vanno a scuola.|My children go to school.|Мои дети ходят в школу.
libro|ˈliːbro|книга|Questo libro è di Marco.|This book is Marco's.|Эта книга Марко.
parola|paˈrɔːla|слово|Non conosco questa parola.|I don't know this word.|Я не знаю это слово.
nome|ˈnoːme|имя|Scrivi il tuo nome qui, per favore.|Write your name here, please.|Напиши своё имя здесь, пожалуйста.
vita|ˈviːta|жизнь|La vita a Roma è bella.|Life in Rome is beautiful.|Жизнь в Риме прекрасна.
mondo|ˈmondo|мир|Il mondo è grande.|The world is big.|Мир большой.
parte|ˈparte|часть|Questa è la mia parte preferita del film.|This is my favorite part of the film.|Это моя любимая часть фильма.
modo|ˈmɔːdo|способ, образ|Non c'è un altro modo.|There is no other way.|Другого способа нет.
cosa|ˈkɔːza| вещь|La cosa più importante è la salute.|The most important thing is health.|Самое важное — это здоровье.
posto|ˈpɔsto|место|Questo posto è libero?|Is this seat free?|Это место свободно?
signora|siɲˈɲoːra|синьора, госпожа|Buongiorno, signora Rossi!|Good morning, Mrs. Rossi!|Добрый день, синьора Росси!
amore|aˈmoːre| любовь|L'amore è importante nella vita.|Love is important in life.|Любовь важна в жизни.
famiglia|faˈmiʎʎa|семья|La mia famiglia abita a Mosca.|My family lives in Moscow.|Моя семья живёт в Москве.
forse|ˈfɔrse|может быть|Forse domani piove.|Maybe it will rain tomorrow.|Может быть, завтра будет дождь.
bene|ˈbɛːne|хорошо|Parli molto bene l'italiano!|You speak Italian very well!|Ты очень хорошо говоришь по-итальянски!
male|ˈmaːle|плохо|Mi sento male.|I feel sick.|Я чувствую себя плохо.
vero|ˈveːro|правда, верный|È vero, hai ragione.|It is true, you are right.|Это правда, ты прав.
essere|ˈɛssere|быть|Sono studente.|I am a student.|Я студент.
avere|aˈveːre|иметь|Ho una sorella.|I have a sister.|У меня есть сестра.
fare|ˈfaːre|делать|Che fai domani?|What are you doing tomorrow?|Что ты будешь делать завтра?
potere|poˈteːre|мочь|Posso aprire la finestra?|Can I open the window?|Можно открыть окно?
volere|ˈvoːlere|хотеть|Voglio un gelato.|I want an ice cream.|Я хочу мороженое.
dovere|ˈdoːvere|быть должным|Devo studiare stasera.|I have to study tonight.|Мне надо позаниматься сегодня вечером.
andare|anˈdaːre|идти, ехать|Vado a scuola in bicicletta.|I go to school by bike.|Я еду в школу на велосипеде.
venire|veˈniːre|приходить|Vieni alla festa?|Are you coming to the party?|Ты придёшь на праздник?
dare|ˈdaːre|давать|Dai il libro a Marco.|Give the book to Marco.|Дай книгу Марко.
dire|ˈdiːre|сказать|Perché non mi dici la verità?|Why don't you tell me the truth?|Почему ты не говоришь мне правду?
vedere|veˈdeːre|видеть|Vedo il mare dalla finestra.|I see the sea from the window.|Я вижу море из окна.
sapere|saˈpeːre|знать|Non lo so.|I don't know.|Я не знаю.
parlare|parˈlaːre|разговаривать|Parlo italiano e un po' d'inglese.|I speak Italian and a little English.|Я говорю по-итальянски и немного по-английски.
trovare|troˈvaːre|находить|Non trovo le chiavi.|I can't find the keys.|Не могу найти ключи.
stare|ˈstaːre|быть, находиться|Sto bene, grazie.|I am fine, thanks.|У меня всё хорошо, спасибо.
prendere|ˈprɛndere|брать|Prendo un caffè.|I'll have a coffee.|Я возьму кофе.
mettere|ˈmettere| класть|Metto il libro sul tavolo.|I put the book on the table.|Я кладу книгу на стол.
uscire|uʃˈʃiːre|выходить|Esco di casa alle otto.|I leave the house at eight.|Я выхожу из дома в восемь.
passare|pasˈsaːre| проходить|Passo il weekend con la famiglia.|I spend the weekend with my family.|Я провожу выходные с семьёй.
guardare|ɡwarˈdaːre|смотреть|Guardo la TV la sera.|I watch TV in the evening.|Я смотрю телевизор вечером.
cercare|tʃerˈkaːre|искать|Cerco un lavoro nuovo.|I am looking for a new job.|Я ищу новую работу.
ricordare|rikorˈdaːre|помнить|Non ricordo il suo nome.|I don't remember his name.|Я не помню его имя.
credere|ˈkreːdere|верить, считать|Non credo a questa storia.|I don't believe this story.|Я не верю в эту историю.
sentire|senˈtiːre| слышать|Sento un rumore strano.|I hear a strange noise.|Я слышу странный шум.
chiedere|ˈkjɛːdere|спрашивать|Chiedo informazioni in stazione.|I ask for information at the station.|Я спрашиваю информацию на вокзале.
rispondere|risˈpɔndere|отвечать|Rispondo sempre alle email.|I always answer emails.|Я всегда отвечаю на письма.
leggere|ˈleddʒere|читать|Leggo un libro ogni mese.|I read a book every month.|Я читаю книгу каждый месяц.
scrivere|ˈskriːvere|писать|Scrivo una lettera alla nonna.|I write a letter to grandma.|Я пишу письмо бабушке.
mangiare|manˈdʒaːre|есть|Mangio la pasta ogni giorno.|I eat pasta every day.|Я ем пасту каждый день.
bere|ˈbeːre|пить|Bevi acqua o vino?|Do you drink water or wine?|Ты пьёшь воду или вино?
dormire|dorˈmiːre|спать|Dormo otto ore ogni notte.|I sleep eight hours every night.|Я сплю восемь часов каждую ночь.
lavorare|lavoˈraːre|работать|Lavoro in un ufficio.|I work in an office.|Я работаю в офисе.
vivere|ˈviːvere|жить|Vivo a Roma da dieci anni.|I have lived in Rome for ten years.|Я живу в Риме десять лет.
conoscere|koˈnoʃʃere|знать, быть знакомым|Conosco bene questa città.|I know this city well.|Я хорошо знаю этот город.
pensare|penˈsaːre|думать|Penso spesso a te.|I often think about you.|Я часто думаю о тебе.
amare|aˈmaːre|любить|Amo la musica italiana.|I love Italian music.|Я люблю итальянскую музыку.
capire|kaˈpiːre|понимать|Non capisco questa parola.|I don't understand this word.|Я не понимаю это слово.
finire|fiˈniːre|заканчивать|Finisco di lavorare alle sei.|I finish work at six.|Я заканчиваю работать в шесть.
partire|parˈtiːre|уезжать, отправляться|Il treno parte alle nove.|The train leaves at nine.|Поезд отправляется в девять.
arrivare|arriˈvaːre| прибывать|Arriviamo domani mattina.|We arrive tomorrow morning.|Мы приедем завтра утром.
rimanere|rimaˈniːre|оставаться|Rimango a casa oggi.|I am staying home today.|Я остаюсь сегодня дома.
diventare|divenˈtaːre|становиться|Mia sorella diventa medico.|My sister is becoming a doctor.|Моя сестра становится врачом.
iniziare|innitˈtsjaːre|начинать|Il film inizia alle otto.|The film starts at eight.|Фильм начинается в восемь.
continuare|kontinuˈaːre|продолжать|Continui sempre a parlare!|You keep talking all the time!|Ты всё время продолжаешь говорить!
salire|saˈliːre|подниматься|Saliamo in macchina.|Let's get in the car.|Давай сядем в машину.
scendere|ˈʃɛndere|спускаться|Scendo alla prossima fermata.|I get off at the next stop.|Я выхожу на следующей остановке.
insegnare|inseɲˈɲaːre|преподавать|Insegno inglese in una scuola.|I teach English at a school.|Я преподаю английский в школе.
preferire|preferiˈre|предпочитать|Preferisco il tè al caffè.|I prefer tea to coffee.|Я предпочитаю чай кофе.
raccontare|rakkonˈtaːre|рассказывать|La nonna racconta una storia.|Grandma is telling a story.|Бабушка рассказывает историю.
ascoltare|askolˈtaːre|слушать|Ascolto musica in autobus.|I listen to music on the bus.|Я слушаю музыку в автобусе.
fratello|fraˈtɛllo|брат|Mio fratello ha dieci anni.|My brother is ten years old.|Моему брату десять лет.
sorella|soˈrɛlla|сестра|Mia sorella abita a Torino.|My sister lives in Turin.|Моя сестра живёт в Турине.
figlio|ˈfiʎʎo|сын|Il figlio di Anna si chiama Paolo.|Anna's son is called Paolo.|Сына Анны зовут Паоло.
figlia|ˈfiʎʎa|дочь|La loro figlia ha cinque anni.|Their daughter is five years old.|Их дочери пять лет.
marito|maˈriːto|муж|Suo marito è cuoco.|Her husband is a cook.|Её муж — повар.
moglie|ˈmoʎʎe|жена|La moglie di Marco è medico.|Marco's wife is a doctor.|Жена Марко — врач.
ragazzo|raˈɡattso|парень, мальчик|Il ragazzo gioca a calcio.|The boy is playing football.|Мальчик играет в футбол.
ragazza|raˈɡattsa|девушка|La ragazza legge un libro.|The girl is reading a book.|Девушка читает книгу.
gente|ˈdʒɛnte|люди|In piazza c'è poca gente.|There are few people in the square.|На площади мало людей.
paese|paˈeːze| страна|L'Italia è un paese bellissimo.|Italy is a very beautiful country.|Италия — очень красивая страна.
latte|ˈlatte|молоко|Bevo il latte ogni mattina.|I drink milk every morning.|Я пью молоко каждое утро.
birra|ˈbirra|пиво|Una birra fresca, per favore.|A cold beer, please.|Холодное пиво, пожалуйста.
tè|tɛ|чай|Vuoi un tè caldo?|Do you want a hot tea?|Хочешь горячего чаю?
zucchero|ˈtsukkero|сахар|Non metto zucchero nel caffè.|I don't put sugar in my coffee.|Я не кладу сахар в кофе.
sale|ˈsaːle|соль|Quanto costa il sale?|How much is the salt?|Сколько стоит соль?
pasta|ˈpasta|паста|La pasta italiana è famosa nel mondo.|Italian pasta is famous in the world.|Итальянская паста известна во всём мире.
carne|ˈkarne|мясо|Mangio poca carne.|I eat little meat.|Я мало ем мяса.
pesce|ˈpeʃʃe|рыба|Il pesce nuota veloce.|The fish swims fast.|Рыба плавает быстро.
formaggio|forˈmaddʒo|сыр|Questo formaggio è molto buono.|This cheese is very good.|Этот сыр очень хороший.
frutta|ˈfrutta|фрукты|Mangio tanta frutta in estate.|I eat a lot of fruit in summer.|Летом я ем много фруктов.
riso|ˈriːzo|рис|Il riso è un piatto tipico qui.|Rice is a typical dish here.|Рис — типичное блюдо здесь.
uovo|ˈwɔːvo|яйцо|Mangio un uovo a colazione.|I eat an egg for breakfast.|Я ем яйцо на завтрак.
verdura|verˈduːra|овощи|Compro verdura fresca al mercato.|I buy fresh vegetables at the market.|Я покупаю свежие овощи на рынке.
piede|ˈpjɛːde|нога (ступня)|Mi fa male il piede destro.|My right foot hurts.|У меня болит правая ступня.
orecchio|oˈrɛkkjo|ухо|Mi fa male l'orecchio.|My ear hurts.|У меня болит ухо.
naso|ˈnaːzo|нос|Il mio naso è rosso dal freddo.|My nose is red from the cold.|Мой нос покраснел от холода.
bocca|ˈbokka|рот|Non parlare con la bocca piena!|Don't talk with your mouth full!|Не разговаривай с полным ртом!
dente|ˈdɛnte|зуб|Il bambino ha un dente nuovo.|The child has a new tooth.|У ребёнка новый зуб.
braccio|ˈbrattʃo|рука (от плеча)|Mi fa male il braccio destro.|My right arm hurts.|У меня болит правая рука.
gamba|ˈɡamba|нога|Dopo la corsa mi fanno male le gambe.|After running my legs hurt.|После бега у меня болят ноги.
cuore|ˈkwoːre|сердце|Il mio cuore batte forte.|My heart beats fast.|Моё сердце сильно бьётся.
capello|kaˈpɛllo|волос|Ho un capello bianco!|I have a white hair!|У меня есть белый волос!
stanza|ˈstantsa|комната|La mia stanza è piccola ma luminosa.|My room is small but bright.|Моя комната маленькая, но светлая.
cucina|kuˈtʃiːna|кухня|La cucina è la mia stanza preferita.|The kitchen is my favorite room.|Кухня — моя любимая комната.
bagno|ˈbaɲɲo|ванная|Il bagno è a destra.|The bathroom is on the right.|Ванная справа.
letto|ˈletto|кровать|Il gatto dorme sul letto.|The cat is sleeping on the bed.|Кот спит на кровати.
sedia|ˈsɛːdja|стул|Questa sedia è molto comoda.|This chair is very comfortable.|Этот стул очень удобный.
tavolo|ˈtaːvolo|стол|I piatti sono sul tavolo.|The plates are on the table.|Тарелки на столе.
porta|ˈpɔrta|дверь|Chiudi la porta a chiave.|Lock the door.|Закрой дверь на ключ.
finestra|fiˈnɛstra|окно|Dalla finestra vedo il giardino.|From the window I see the garden.|Из окна я вижу сад.
chiave|ˈkjaːve|ключ|Ho perso le chiavi della casa.|I lost the house keys.|Я потерял ключи от дома.
piazza|ˈpjattsa|площадь|Ci vediamo in piazza alle dieci.|Let's meet in the square at ten.|Встретимся на площади в десять.
via|ˈviːa|улица|Abito in via Roma.|I live on Roma street.|Я живу на улице Рома.
ponte|ˈponte|мост|Il ponte sul fiume è vecchio.|The bridge over the river is old.|Мост через реку старый.
stazione|statˈtsjoːne| вокзал|La stazione è vicino al centro.|The station is near the center.|Вокзал рядом с центром.
aeroporto|aeroˈpɔrto|аэропорт|L'aeroporto è lontano dalla città.|The airport is far from the city.|Аэропорт далеко от города.
aereo|aˈɛːreo|самолёт|L'aereo decolla alle nove.|The plane takes off at nine.|Самолёт взлетает в девять.
treno|ˈtreːno|поезд|Il treno per Roma è in ritardo.|The train to Rome is late.|Поезд на Рим опаздывает.
autobus|ˈautobus|автобус|Prendo l'autobus ogni giorno.|I take the bus every day.|Я каждый день езжу на автобусе.
macchina|ˈmakkina|машина|La sua macchina è nuova.|His car is new.|Его машина новая.
bicicletta|bitʃiˈkletta|велосипед|Vado al lavoro in bicicletta.|I go to work by bike.|Я еду на работу на велосипеде.
biglietto|biʎˈʎɛtto|билет|Due biglietti per Milano, per favore.|Two tickets to Milan, please.|Два билета до Милана, пожалуйста.
valigia|vaˈliːdʒa|чемодан|La mia valigia è molto pesante.|My suitcase is very heavy.|Мой чемодан очень тяжёлый.
viaggio|ˈviaddʒo|путешествие|Il viaggio dura tre ore.|The trip takes three hours.|Поездка длится три часа.
mare|ˈmaːre|море|In agosto andiamo al mare.|In August we go to the sea.|В августе мы едем на море.
spiaggia|ˈspjaddʒa|пляж|La spiaggia è piena di gente.|The beach is full of people.|Пляж полон людей.
montagna|monˈtaɲɲa|горы|In inverno vado in montagna.|In winter I go to the mountains.|Зимой я езжу в горы.
lago|ˈlaːɡo|озеро|Il lago è molto profondo.|The lake is very deep.|Озеро очень глубокое.
fiume|ˈfjuːme|река|Il fiume passa in mezzo alla città.|The river flows through the city.|Река течёт через город.
sole|ˈsoːle|солнце|Oggi il sole è forte.|Today the sun is strong.|Сегодня солнце сильное.
luna|ˈluːna|луна|Stanotte la luna è bellissima.|Tonight the moon is very beautiful.|Сегодня ночью луна очень красивая.
stella|ˈstɛlla|звезда|Di notte vedo tante stelle.|At night I see many stars.|Ночью я вижу много звёзд.
cielo|ˈtʃɛːlo|небо|Il cielo oggi è azzurro.|The sky is blue today.|Небо сегодня голубое.
pioggia|ˈpjɔddʒa|дождь|Odio la pioggia in città.|I hate rain in the city.|Ненавижу дождь в городе.
neve|ˈneːve|снег|Domani arriva la neve in montagna.|Snow is coming to the mountains tomorrow.|Завтра в горы придёт снег.
vento|ˈvɛnto|ветер|Il vento soffia forte oggi.|The wind blows hard today.|Сегодня ветер дует сильно.
caldo|ˈkaldo|жара, тёплый|Fa caldo in agosto.|It is hot in August.|В августе жарко.
freddo|ˈfreddo|холод, холодный|In inverno fa freddo qui.|It is cold here in winter.|Зимой здесь холодно.
giornale|dʒorˈnaːle|газета|Leggo il giornale la mattina.|I read the newspaper in the morning.|Я читаю газету утром.
penna|ˈpɛnna|ручка|Mi presti una penna, per favore?|Can you lend me a pen, please?|Дашь мне ручку, пожалуйста?
pagina|ˈpaːdʒina|страница|Leggo dieci pagine ogni sera.|I read ten pages every evening.|Я читаю десять страниц каждый вечер.
frase|ˈfraːze|фраза|Ripeti questa frase, per favore.|Repeat this phrase, please.|Повтори эту фразу, пожалуйста.
storia|ˈstɔːrja|история|La storia romana è molto interessante.|Roman history is very interesting.|Римская история очень интересная.
musica|ˈmuːzika|музыка|Ascolto musica mentre lavoro.|I listen to music while I work.|Я слушаю музыку, когда работаю.
film|film|фильм|Il film inizia alle nove.|The film starts at nine.|Фильм начинается в девять.
canzone|kanˈtsoːne|песня|Questa canzone è molto famosa.|This song is very famous.|Эта песня очень известная.
gioco|ˈdʒɔːko|игра|Questo gioco è facile.|This game is easy.|Эта игра лёгкая.
festa|ˈfɛsta|праздник|Domani c'è una festa in piazza.|Tomorrow there is a party in the square.|Завтра на площади праздник.
regalo|reˈɡaːlo|подарок|Ti ho comprato un regalo.|I bought you a present.|Я купил тебе подарок.
studente|stuˈdɛnte|студент|Lo studente studia molto per l'esame.|The student studies a lot for the exam.|Студент много занимается перед экзаменом.
professore|profesˈsoːre|профессор, преподаватель|Il professore spiega la lezione.|The professor explains the lesson.|Профессор объясняет урок.
lezione|letˈtsjoːne|урок|La lezione dura un'ora.|The lesson lasts an hour.|Урок длится час.
classe|ˈklasse|класс|Ci sono venti studenti in classe.|There are twenty students in the class.|В классе двадцать студентов.
università|universiˈta|университет|Mio figlio studia all'università.|My son studies at the university.|Мой сын учится в университете.
esame|eˈzaːme|экзамен|L'esame è molto difficile.|The exam is very difficult.|Экзамен очень трудный.
ufficio|ufˈfiːtʃo|офис|Il mio ufficio è al terzo piano.|My office is on the third floor.|Мой офис на третьем этаже.
capo|ˈkaːpo|начальник|Il mio capo è molto gentile.|My boss is very kind.|Мой начальник очень добрый.
collega|kolˈleːɡa|коллега|I miei colleghi sono simpatici.|My colleagues are nice.|Мои коллеги приятные.
dottore|dotˈtoːre|врач|Devo andare dal dottore.|I have to go to the doctor.|Мне надо пойти к врачу.
ospedale|ospeˈdaːle|больница|L'ospedale è vicino alla stazione.|The hospital is near the station.|Больница рядом с вокзалом.
medicina|mediˈtʃiːna|лекарство|Prendo la medicina tre volte al giorno.|I take the medicine three times a day.|Я принимаю лекарство три раза в день.
salute|saˈluːte|здоровье|La salute è la cosa più importante.|Health is the most important thing.|Здоровье — самое важное.
farmacia|farmaˈtʃiːa|аптека|La farmacia chiude alle otto.|The pharmacy closes at eight.|Аптека закрывается в восемь.
prezzo|ˈprɛttso|цена|Il prezzo è troppo alto.|The price is too high.|Цена слишком высокая.
negozio|neˈɡɔːtsjo|магазин|Il negozio apre alle nove.|The shop opens at nine.|Магазин открывается в девять.
mercato|merˈkaːto|рынок|Compro la frutta al mercato.|I buy fruit at the market.|Я покупаю фрукты на рынке.
banca|ˈbanka|банк|Lavoro in una banca.|I work in a bank.|Я работаю в банке.
conto|ˈkonto|счёт|Il conto, per favore.|The bill, please.|Счёт, пожалуйста.
numero|ˈnuːmero|номер, число|Qual è il tuo numero di telefono?|What is your phone number?|Какой у тебя номер телефона?
volta|ˈvɔlta|раз|Vado in piscina due volte alla settimana.|I go to the pool twice a week.|Я хожу в бассейн два раза в неделю.
motivo|moˈtiːvo|причина|Qual è il motivo del tuo viaggio?|What is the reason for your trip?|Какая причина твоей поездки?
idea|iˈdeːa|идея|Ho una buona idea!|I have a good idea!|У меня есть хорошая идея!
risposta|risˈpɔsta|ответ|La tua risposta è corretta.|Your answer is correct.|Твой ответ правильный.
domanda|doˈmanda|вопрос|Ho una domanda per te.|I have a question for you.|У меня к тебе вопрос.
fine|ˈfiːne|конец|Il film è bello fino alla fine.|The film is good until the end.|Фильм хорош до самого конца.
inizio|inˈnitsjo|начало|L'inizio del libro è noioso.|The beginning of the book is boring.|Начало книги скучное.
bello|ˈbɛllo|красивый|Il tuo giardino è molto bello.|Your garden is very beautiful.|Твой сад очень красивый.
brutto|ˈbrutto|некрасивый|Il tempo è brutto oggi.|The weather is bad today.|Сегодня плохая погода.
buono|ˈbwɔːno|хороший|Questo gelato è buonissimo!|This ice cream is very good!|Это мороженое очень вкусное!
cattivo|katˈtiːvo|плохой|Il cane non è cattivo.|The dog is not mean.|Собака не злая.
grande|ˈɡrande|большой|Milano è una città grande.|Milan is a big city.|Милан — большой город.
piccolo|ˈpikkolo|маленький|Abito in un appartamento piccolo.|I live in a small apartment.|Я живу в маленькой квартире.
alto|ˈalto|высокий|Mio fratello è molto alto.|My brother is very tall.|Мой брат очень высокий.
basso|ˈbasso|низкий|Il muro è basso.|The wall is low.|Стена низкая.
lungo|ˈluŋɡo|длинный|Il fiume è lungo trecento chilometri.|The river is three hundred kilometers long.|Река длиной триста километров.
nuovo|ˈnwɔːvo|новый|Ho una macchina nuova.|I have a new car.|У меня новая машина.
vecchio|ˈvɛkkjo|старый|Questo libro è molto vecchio.|This book is very old.|Эта книга очень старая.
giovane|ˈdʒoːvane|молодой|Mia zia è ancora giovane.|My aunt is still young.|Моя тётя ещё молодая.
facile|ˈfaːtʃile| лёгкий|Questo esercizio è facile.|This exercise is easy.|Это упражнение лёгкое.
difficile|difˈfiːtʃile|трудный|La grammatica italiana è difficile.|Italian grammar is difficult.|Итальянская грамматика трудная.
veloce|veˈloːtʃe|быстрый|Il treno è molto veloce.|The train is very fast.|Поезд очень быстрый.
lento|ˈlɛnto|медленный|Internet oggi è lento.|The internet is slow today.|Интернет сегодня медленный.
forte|ˈfɔrte|сильный|Il caffè italiano è molto forte.|Italian coffee is very strong.|Итальянский кофе очень крепкий.
debole|ˈdeːbole|слабый|Il tè è troppo debole.|The tea is too weak.|Чай слишком слабый.
pieno|ˈpjɛːno|полный|L'autobus è pieno di gente.|The bus is full of people.|Автобус полон людей.
vuoto|ˈvwɔːto|пустой|Il frigorifero è vuoto.|The fridge is empty.|Холодильник пустой.
aperto|aˈpɛrto|открытый|Il negozio è aperto fino alle nove.|The shop is open until nine.|Магазин открыт до девяти.
chiuso|ˈkjuːzo|закрытый|La banca è chiusa la domenica.|The bank is closed on Sunday.|Банк закрыт в воскресенье.
caro|ˈkaːro|дорогой|Questo ristorante è troppo caro.|This restaurant is too expensive.|Этот ресторан слишком дорогой.
economico|ekonoˈmiːko|дешёвый|Questo telefono è economico.|This phone is cheap.|Этот телефон дешёвый.
ricco|ˈrikko|богатый|È un uomo ricco e famoso.|He is a rich and famous man.|Он богатый и знаменитый человек.
povero|ˈpɔːvero|бедный|Questo signore è povero ma felice.|This man is poor but happy.|Этот человек бедный, но счастливый.
importante|importaˈnte|важный|È una riunione importante.|It is an important meeting.|Это важная встреча.
interessante|interesˈsante|интересный|Il tuo lavoro sembra interessante.|Your job seems interesting.|Твоя работа кажется интересной.
noioso|ˈnɔjoːzo|скучный|La riunione era molto noiosa.|The meeting was very boring.|Совещание было очень скучным.
pulito|puˈliːto|чистый|La mia stanza è sempre pulita.|My room is always clean.|Моя комната всегда чистая.
sporco|ˈsporko|грязный|Le tue scarpe sono sporche.|Your shoes are dirty.|Твои ботинки грязные.
felice|feˈliːtʃe|счастливый|Sono felice di vederti!|I am happy to see you!|Я счастлив тебя видеть!
triste|ˈtriste|грустный|Il film è bello ma triste.|The film is good but sad.|Фильм хороший, но грустный.
stanco|ˈstanko|уставший|Sono stanco, vado a dormire.|I am tired, I am going to sleep.|Я устал, иду спать.
affamato|affaˈmaːto|голодный|Sono affamato, mangiamo?|I am hungry, shall we eat?|Я голодный, поедим?
assetato|assetˈtaːto|жаждущий|Sono assetato, bevo un bicchiere d'acqua.|I am thirsty, I'll drink a glass of water.|Я хочу пить, выпью стакан воды.
pronto|ˈpronto|готовый|La cena è pronta!|Dinner is ready!|Ужин готов!
ultimo|ˈultimo|последний|L'ultimo autobus parte a mezzanotte.|The last bus leaves at midnight.|Последний автобус уходит в полночь.
primo|ˈpriːmo|первый|Il primo giorno della settimana è lunedì.|The first day of the week is Monday.|Первый день недели — понедельник.
vicino|viˈtʃiːno|близкий, рядом|Il supermercato è vicino a casa mia.|The supermarket is near my house.|Супермаркет рядом с моим домом.
lontano|lonˈtaːno|далёкий|Il centro è lontano da qui?|Is the center far from here?|Центр далеко отсюда?
insieme|inˈsjɛːme|вместе|Andiamo al cinema insieme.|Let's go to the cinema together.|Пойдём в кино вместе.
davvero|davˈveːro|действительно|È davvero un buon film.|It is really a good film.|Это действительно хороший фильм.
ancora|anˈkoːra|ещё, снова|Posso avere ancora un po' di tè?|Can I have some more tea?|Можно ещё немного чая?
già|dʒa|уже|Ho già finito i compiti.|I have already finished my homework.|Я уже закончил домашнюю работу.
quasi|ˈkwaːzi|почти|Sono quasi pronto.|I am almost ready.|Я почти готов.
subito|ˈsuːbito|сразу|Vengo subito!|I am coming right away!|Я иду сразу!
adesso|aˈdɛsso|сейчас|Adesso non posso parlare.|I can't talk right now.|Я сейчас не могу говорить.
poi|pɔi| потом|Prima mangio, poi studio.|First I eat, then I study.|Сначала я ем, потом учусь.
dopo|ˈdɔːpo| после|Dopo il lavoro vado a casa.|After work I go home.|После работы я иду домой.
prima|ˈpriːma| до|Prima di mangiare mi lavo le mani.|Before eating I wash my hands.|Перед едой я мою руки.
dentro|ˈdɛntro|внутри|I documenti sono dentro la borsa.|The documents are inside the bag.|Документы внутри сумки.
fuori|ˈfwɔːri|снаружи|Fuori piove.|It is raining outside.|На улице идёт дождь.
sopra|ˈsɔːpra|наверху|Il mio telefono è sopra il tavolo.|My phone is on the table.|Мой телефон на столе.
sotto|ˈsɔtto|внизу|Il gatto dorme sotto il letto.|The cat sleeps under the bed.|Кот спит под кроватью.
vicino a|viˈtʃiːno a|рядом с|La farmacia è vicino alla banca.|The pharmacy is near the bank.|Аптека рядом с банком.
  `;

// расширение частотного списка до 1000 слов (только для набора «1000 самых частотных слов»)
const CORE_EXT = `
quattro|ˈkwattro|четыре|Ho quattro sorelle.|I have four sisters.|У меня четыре сестры.
cinque|ˈtʃiŋkwe|пять|Il treno parte alle cinque.|The train leaves at five.|Поезд отправляется в пять.
sei|ˈsɛi|шесть|Oggi sono le sei.|Today it is six o'clock.|Сегодня шесть часов.
sette|ˈsɛtte|семь|La lezione inizia alle sette.|The lesson starts at seven.|Урок начинается в семь.
otto|ˈɔtto|восемь|Chiudo il negozio alle otto.|I close the shop at eight.|Я закрываю магазин в восемь.
nove|ˈnɔːve|девять|Sono le nove di sera.|It is nine in the evening.|Сейчас девять вечера.
dieci|ˈdjɛːtʃi|десять|Il film dura due ore e dieci.|The film lasts two hours and ten.|Фильм идёт два часа десять минут.
undici|ˈunditʃi|одиннадцать|Ho undici messaggi non letti.|I have eleven unread messages.|У меня одиннадцать непрочитанных сообщений.
dodici|ˈdɔditʃi|двенадцать|A pranzo alle dodici.|We have lunch at twelve.|Мы обедаем в двенадцать.
tredici|ˈtrɛditʃi|тринадцать|Il mio numero è il tredici.|My number is thirteen.|Мой номер — тринадцать.
quattordici|kwatˈtɔrditʃi|четырнадцать|Ho quattordici anni.|I am fourteen years old.|Мне четырнадцать лет.
quindici|ˈkwinditʃi|пятнадцать|Il bus arriva alle quindici.|The bus arrives at fifteen hundred.|Автобус прибывает в пятнадцать ноль-ноль.
sedici|ˈsɛditʃi|шестнадцать|La riunione è alle sedici.|The meeting is at four p.m.|Собрание в шестнадцать часов.
diciassette|ditʃasˈsɛtte|семнадцать|Paghi solo diciassette euro.|You pay only seventeen euros.|Ты платишь всего семнадцать евро.
diciotto|diˈtʃɔtto|восемнадцать|È maggiorenne a diciotto anni.|You come of age at eighteen.|Совершеннолетие наступает в восемнадцать.
diciannove|ditʃanˈnɔːve|девятнадцать|La mia stanza è la diciannove.|My room is number nineteen.|Моя комната — девятнадцатая.
venti|ˈvɛnti|двадцать|Questo libro costa venti euro.|This book costs twenty euros.|Эта книга стоит двадцать евро.
trenta|ˈtrɛnta|тридцать|Marco ha trenta anni.|Marco is thirty years old.|Марко тридцать лет.
quaranta|kwaˈranta|сорок|L'autobus passa ogni quaranta minuti.|The bus runs every forty minutes.|Автобус ходит каждые сорок минут.
cinquanta|tʃiŋˈkwanta|пятьдесят|Ho solo cinquanta euro.|I have only fifty euros.|У меня всего пятьдесят евро.
sessanta|sesˈsanta|шестьдесят|Il nonno ha sessanta anni.|Grandfather is sixty years old.|Дедушке шестьдесят лет.
settanta|setˈtanta|семьдесят|La velocità è settanta all'ora.|The speed is seventy per hour.|Скорость — семьдесят в час.
ottanta|otˈtanta|восемьдесят|La casa ha ottanta anni.|The house is eighty years old.|Дому восемьдесят лет.
novanta|noˈvanta|девяносто|Novanta studenti passano l'esame.|Ninety students pass the exam.|Девяносто студентов сдают экзамен.
cento|ˈtʃɛnto|сто|Ho cento foto sul telefono.|I have a hundred photos on my phone.|У меня сто фото на телефоне.
mille|ˈmille|тысяча|Questa città ha mille anni.|This city is a thousand years old.|Этому городу тысяча лет.
milione|miˈljoːne|миллион|Un milione di persone visitano il museo.|A million people visit the museum.|Миллион человек посещают музей.
mezzo|ˈmɛddzo|половина|Ho solo mezzo giorno libero.|I have only half a day off.|У меня всего полдня выходного.
doppio|ˈdoppjo| двойной|Vorrei un caffè doppio.|I would like a double coffee.|Я хотел бы двойной кофе.
terzo|ˈtʃɛrtso|третий|Il terzo piano è sopra.|The third floor is above.|Третий этаж выше.
quarto|ˈkwarto|четвёртый|Vivo al quarto piano.|I live on the fourth floor.|Я живу на четвёртом этаже.
lunedì|luneˈdi|понедельник|Lunedì torno al lavoro.|On Monday I go back to work.|В понедельник я возвращаюсь на работу.
martedì|marteˈdi|вторник|Martedì ho una lezione.|On Tuesday I have a lesson.|Во вторник у меня урок.
mercoledì|merkoleˈdi|среда|Mercoledì vado dal dottore.|On Wednesday I go to the doctor.|В среду я иду к врачу.
giovedì|dʒoveˈdi|четверг|Giovedì ceno da Marco.|On Thursday I have dinner at Marco's.|В четверг я ужинаю у Марко.
venerdì|venerˈdi|пятница|Venerdì sera usciamo insieme.|On Friday evening we go out together.|В пятницу вечером мы идём гулять вместе.
sabato|ˈsabato|суббота|Sabato gioco a calcio.|On Saturday I play football.|В субботу я играю в футбол.
domenica|doˈmenika|воскресенье|La domenica riposo a casa.|On Sunday I rest at home.|В воскресенье я отдыхаю дома.
gennaio|dʒenˈnajo|январь|Il corso inizia a gennaio.|The course starts in January.|Курс начинается в январе.
febbraio|febˈbrajo|февраль|A febbraio piove spesso.|In February it often rains.|В феврале часто идёт дождь.
marzo|ˈmartso|март|A marzo fioriscono gli alberi.|In March the trees blossom.|В марте цветут деревья.
aprile|aˈpriːle|апрель|Il mio compleanno è ad aprile.|My birthday is in April.|Мой день рождения в апреле.
maggio|ˈmaddʒo|май|A maggio vado al mare.|In May I go to the sea.|В мае я еду на море.
giugno|ˈdʒuɲɲo|июнь|Giugno è un mese caldo.|June is a warm month.|Июнь — тёплый месяц.
luglio|ˈluʎʎo|июль|A luglio sono in vacanza.|In July I am on holiday.|В июле я в отпуске.
agosto|aˈɡɔsto|август|Agosto è il mese delle vacanze.|August is the month of holidays.|Август — месяц отпусков.
settembre|setˈtɛmbre|сентябрь|A settembre torno a scuola.|In September I go back to school.|В сентябре я возвращаюсь в школу.
ottobre|otˈtɔbre|октябрь|A ottobre le foglie cadono.|In October the leaves fall.|В октябре падают листья.
novembre|noˈvɛmbre|ноябрь|Novembre è un mese piovoso.|November is a rainy month.|Ноябрь — дождливый месяц.
dicembre|diˈtʃɛmbre|декабрь|A dicembre preparo i regali.|In December I prepare presents.|В декабре я готовлю подарки.
primavera|primaˈveːra|весна|In primavera fa più caldo.|In spring it is warmer.|Весной теплее.
estate|eˈstate|лето|L'estate è la mia stagione preferita.|Summer is my favourite season.|Лето — моё любимое время года.
autunno|auˈtunno|осень|In autunno leggo molti libri.|In autumn I read many books.|Осенью я читаю много книг.
inverno|inˈvɛrno|зима|In inverno nevica in montagna.|In winter it snows in the mountains.|Зимой в горах идёт снег.
rosso|ˈrosso|красный|Ho comprato una maglia rossa.|I bought a red T-shirt.|Я купил красную футболку.
blu|blu|синий, голубой|Il mare è blu oggi.|The sea is blue today.|Море сегодня синее.
verde|ˈverde|зелёный|Il semaforo è verde.|The traffic light is green.|Светофор зелёный.
giallo|ˈdʒallo|жёлтый|La mia macchina è gialla.|My car is yellow.|Моя машина жёлтая.
nero|ˈneːro|чёрный|Il gatto è nero.|The cat is black.|Кот чёрный.
bianco|ˈbjaŋko|белый|Il vino bianco è fresco.|White wine is cool.|Белое вино прохладное.
arancione|aranˈtʃone|оранжевый|Il suo zaino è arancione.|His backpack is orange.|Его рюкзак оранжевый.
rosa|ˈrɔza|розовый|La sua stanza è rosa.|Her room is pink.|Её комната розовая.
grigio|ˈɡridʒo|серый|Il gatto grigio dorme.|The grey cat is sleeping.|Серый кот спит.
marrone|marˈrone|коричневый|Il cane è marrone.|The dog is brown.|Собака коричневая.
viola|viˈɔla|фиолетовый|Il suo vestito è viola.|Her dress is purple.|Её платье фиолетовое.
chiaro|ˈkjaːro|светлый, ясный|Il cielo è chiaro oggi.|The sky is clear today.|Небо сегодня ясное.
scuro|ˈskuːro|тёмный|La stanza è troppo scura.|The room is too dark.|Комната слишком тёмная.
nonno|ˈnɔnno|дедушка|Il nonno racconta una storia.|Grandfather tells a story.|Дедушка рассказывает историю.
nonna|ˈnɔnna|бабушка|La nonna prepara la torta.|Grandmother makes the cake.|Бабушка готовит торт.
zio|ˈtsio|дядя|Mio zio abita a Roma.|My uncle lives in Rome.|Мой дядя живёт в Риме.
zia|ˈtsia|тётя|Mia zia parla inglese.|My aunt speaks English.|Моя тётя говорит по-английски.
cugino|kuˈdʒino| двоюродный брат|Il mio cugino studia medicina.|My cousin studies medicine.|Мой двоюродный брат учится на врача.
cugina|kuˈdʒina|двоюродная сестра|La mia cugina ha due gatti.|My cousin has two cats.|У моей двоюродной сестры два кота.
nipote|niˈpɔte|внук, племянник|Il nipote gioca in giardino.|The grandson plays in the garden.|Внук играет в саду.
genitori|dʒeniˈtori|родители|I miei genitori sono a casa.|My parents are at home.|Мои родители дома.
bambina|bamˈbina| девочка|La bambina dorme tranquilla.|The little girl sleeps peacefully.|Девочка спокойно спит.
ospite|ˈɔspite|гость|Abbiamo un ospite a cena.|We have a guest for dinner.|У нас гость на ужин.
spalla|ˈspalla|плечо|La mia spalla fa male.|My shoulder hurts.|У меня болит плечо.
ginocchio|dʒiˈnɔkkjo|колено|Il bambino si è tagliato il ginocchio.|The child cut his knee.|Ребёнок порезал колено.
dito|ˈdiːto|палец|Indosso un anello al dito.|I wear a ring on my finger.|Я ношу кольцо на пальце.
pollice|ˈpollitʃe|большой палец|Il pollice è il dito più forte.|The thumb is the strongest finger.|Большой палец — самый сильный палец.
collo|ˈkollo|шея|Il collo mi fa male oggi.|My neck hurts today.|Шея сегодня болит.
schiena|ˈsjena|спина|Mi fa male la schiena.|My back hurts.|У меня болит спина.
pelle|ˈpɛlle|кожа|La sua pelle è molto chiara.|Her skin is very fair.|У неё очень светлая кожа.
labbra|ˈlabbra|губы|Le sue labbra sono rosse.|Her lips are red.|Её губы красные.
lingua|ˈliŋɡwa|язык; язык речи|L'italiano è una bella lingua.|Italian is a beautiful language.|Итальянский — красивый язык.
stomaco|ˈstɔmako|живот, желудок|Il mio stomaco brontola.|My stomach is rumbling.|Мой живот урчит.
guancia|ˈɡwantʃa|щёка|Il bambino ha le guance rosa.|The child has pink cheeks.|У ребёнка розовые щёки.
camicia|kaˈmitʃa|рубашка|La mia camicia è bianca.|My shirt is white.|Моя рубашка белая.
maglietta|maʎˈʎetta|футболка|Indosso una maglietta verde.|I am wearing a green T-shirt.|На мне зелёная футболка.
pantaloni|pantaˈloːni|брюки|Questi pantaloni sono comodi.|These trousers are comfortable.|Эти брюки удобные.
gonna|ˈɡonnya|юбка|Mia sorella ha una gonna nuova.|My sister has a new skirt.|У моей сестры новая юбка.
vestito|veˈstiːto|платье; костюм|Indosso un vestito elegante.|I am wearing an elegant dress.|Я одет(а) в элегантное платье.
scarpa|ˈskarpa|ботинок, туфля|Queste scarpe sono nuove.|These shoes are new.|Эти туфли новые.
stivale|stiˈvale|сапог|In inverno indosso gli stivali.|In winter I wear boots.|Зимой я ношу сапоги.
cappotto|kapˈpɔtto|пальто, шуба|Il cappotto è sul letto.|The coat is on the bed.|Пальто на кровати.
giacca|ˈdʒakka|пиджак, куртка|La giacca è nel guardaroba.|The jacket is in the wardrobe.|Пиджак в шкафу.
maglione|maʎˈʎone|свитер|Questo maglione è molto caldo.|This sweater is very warm.|Этот свитер очень тёплый.
cappello|kaˈpɛllo|шляпа, шапка|Mi metto il cappello.|I put on my hat.|Я надеваю шляпу.
sciarpa|ˈʃarpa|шарф|La sciarpa è di lana.|The scarf is made of wool.|Шарф из шерсти.
guanto|ˈɡwanto|перчатка|In inverno porto i guanti.|In winter I wear gloves.|Зимой я ношу перчатки.
cintura|tʃinˈtura|ремень, пояс|La cintura è nella tasca.|The belt is in the pocket.|Ремень в кармане.
calza|ˈkaltsa| носок|Ho perso una calza.|I have lost a sock.|Я потерял носок.
bottone|botˈtoːne|пуговица|Un bottone è caduto dalla camicia.|A button fell off the shirt.|Пуговица оторвалась от рубашки.
tasca|ˈtaska|карман|Le chiavi sono in tasca.|The keys are in the pocket.|Ключи в кармане.
olio|ˈɔːljo|масло|Aggiungo olio all'insalata.|I add oil to the salad.|Я добавляю масло в салат.
aceto|aˈtʃeːto|уксус|Aceto e olio per l'insalata.|Vinegar and oil for the salad.|Уксус и масло для салата.
pepe|ˈpeːpe|перец|Il pepe è troppo piccante.|The pepper is too spicy.|Перец слишком острый.
zuppa|ˈtsuppa|суп|La zuppa è calda.|The soup is hot.|Суп горячий.
insalata|insaˈlata|салат|Preparo un'insalata fresca.|I make a fresh salad.|Я готовлю свежий салат.
dolce|ˈdoltʃe|десерт; сладкий|Come dolce prendo il gelato.|For dessert I have ice cream.|На десерт я беру мороженое.
gelato|dʒeˈlato|мороженое|Un gelato alla vaniglia, per cortesia.|A vanilla ice cream, please.|Мороженое с ванилью, пожалуйста.
torta|ˈtorta|торт, пирог|La torta di compleanno è pronta.|The birthday cake is ready.|Торт ко дню рождения готов.
biscotto|biˈskɔtto|печенье|Un biscotto con il tè.|A biscuit with tea.|Печенье к чаю.
cioccolato|tʃokkoˈlato|шоколад|Il cioccolato fondente è amaro.|Dark chocolate is bitter.|Тёмный шоколад горький.
miele|ˈmjɛːle|мёд|Il tè con il miele è buono.|Tea with honey is good.|Чай с мёдом вкусный.
farina|faˈriːna|мука|Per la torta serve la farina.|The cake needs flour.|Для торта нужна мука.
prosciutto|proʃˈʃutto|ветчина|Un panino con il prosciutto.|A sandwich with ham.|Бутерброд с ветчиной.
pomodoro|pomoˈdoːro|помидор|Insalata con pomodori freschi.|Salad with fresh tomatoes.|Салат со свежими помидорами.
patata|paˈtata|картофель|Le patate lesse sono pronte.|The boiled potatoes are ready.|Варёный картофель готов.
carota|kaˈrɔta|морковь|Le carote sono buone per la vista.|Carrots are good for the eyesight.|Морковь полезна для зрения.
cipolla|tʃiˈpɔlla|лук|La cipolla fa piangere.|Onion makes you cry.|От лука плачут.
aglio|ˈaʎʎo|чеснок|Aggiungo aglio alla pasta.|I add garlic to the pasta.|Я добавляю чеснок в пасту.
limone|liˈmoːne|лимон|Il tè con il limone.|Tea with lemon.|Чай с лимоном.
mela|ˈmeːla|яблоко|Una mela al giorno.|An apple a day.|Яблоко в день.
pera|ˈpeːra|груша|La pera è dolce.|The pear is sweet.|Груша сладкая.
banana|baˈnana|банан|Mangio una banana dopo la corsa.|I eat a banana after the run.|Я ем банан после пробежки.
fragola|ˈfraɡola|земляника, клубника|Le fragole sono con la panna.|The strawberries are with cream.|Клубника со сливками.
uva|ˈuːva|виноград|L'uva è matura.|The grapes are ripe.|Виноград спелый.
minestra|miˈnɛstra|первое блюдо, суп|Come minestra oggi c'è la zuppa.|Today's first course is soup.|На первое сегодня суп.
panino|paˈniːno|бутерброд, булочка|Prendo un panino al bar.|I have a sandwich at the bar.|Я беру бутерброд в баре.
piatto|ˈpjatto|тарелка; блюдо|Il piatto è sul tavolo.|The plate is on the table.|Тарелка на столе.
bicchiere|biˈkkjeːre|стакан, бокал|Un bicchiere d'acqua, grazie.|A glass of water, thanks.|Стакан воды, спасибо.
tazza|ˈtattsa|чашка|Una tazza di tè caldo.|A cup of hot tea.|Чашка горячего чая.
bottiglia|botˈtiʎʎa|бутылка|Compro una bottiglia d'acqua.|I buy a bottle of water.|Я покупаю бутылку воды.
coltello|kolˈtɛllo|нож|Il coltello taglia bene.|The knife cuts well.|Нож режет хорошо.
forchetta|forˈkɛtta|вилка|Servono due forchette.|Two forks are needed.|Нужны две вилки.
cucchiaio|kukˈkjaːjo|ложка|Il cucchiaio è nella tazza.|The spoon is in the cup.|Ложка в чашке.
pranzo|ˈprandzo|обед|Il pranzo è pronto alle dodici.|Lunch is ready at twelve.|Обед готов в двенадцать.
colazione|kolatˈtsjoːne|завтрак|La colazione è alle otto.|Breakfast is at eight.|Завтрак в восемь.
cena|ˈtʃeːna|ужин|La cena è alle vente.|Dinner is at eight p.m.|Ужин в восемь вечера.
succo|ˈsukko|сок|Un succo d'arancia fresco.|A fresh orange juice.|Свежий апельсиновый сок.
ristorante|ristoˈrante|ресторан|Il ristorante è pieno stasera.|The restaurant is full tonight.|Ресторан полон сегодня вечером.
bar|bar|бар, кафе|Ti incontro al bar.|I will meet you at the bar.|Встречу тебя в кафе.
chiesa|ˈkjeːza|церковь|La chiesa è molto antica.|The church is very old.|Церковь очень старая.
museo|muˈzeːo|музей|Il museo è chiuso il lunedì.|The museum is closed on Mondays.|Музей закрыт по понедельникам.
teatro|teˈatro|театр|Andiamo al teatro stasera.|We are going to the theatre tonight.|Мы идём в театр сегодня вечером.
cinema|ˈtʃinema|кинотеатр|Vado al cinema con gli amici.|I go to the cinema with friends.|Я иду в кино с друзьями.
parco|ˈparko|парк|I bambini giocano al parco.|The children play in the park.|Дети играют в парке.
biblioteca|biblioˈtɛːka|библиотека|Studio in biblioteca ogni giorno.|I study in the library every day.|Я учусь в библиотеке каждый день.
piscina|piˈʃʃina|бассейн|La piscina è aperta oggi.|The swimming pool is open today.|Бассейн открыт сегодня.
palestra|paˈleːstra|спортивный зал|Vado in palestra dopo il lavoro.|I go to the gym after work.|Я хожу в спортзал после работы.
stadio|ˈstaːdjo|стадион|Lo stadio è pieno di gente.|The stadium is full of people.|Стадион полон людей.
fabbrica|ˈfabbrika|фабрика, завод|Lavora in una fabbrica di automobili.|He works in a car factory.|Он работает на автомобильном заводе.
centro|ˈtʃɛntro|центр|Il centro città è affollato.|The city centre is crowded.|Центр города людный.
quartiere|kwarˈtjeːre|район|Il mio quartiere è tranquillo.|My neighbourhood is quiet.|Мой район тихий.
campagna|kamˈpaɲɲa|сельская местность|La campagna è bella in primavera.|The countryside is beautiful in spring.|Сельская местность прекрасна весной.
giardino|dʒarˈdiːno|сад|I fiori del giardino profumano.|The flowers in the garden smell nice.|Цветы в саду приятно пахнут.
balcone|balˈkoːne|балкон|Il gatto dorme sul balcone.|The cat sleeps on the balcony.|Кот спит на балконе.
scale|ˈskale|лестница|Le scale sono in fondo al corridoio.|The stairs are at the end of the corridor.|Лестница в конце коридора.
ascensore|aʃʃenˈsoːre|лифт|L'ascensore è rotto di nuovo.|The lift is broken again.|Лифт снова сломан.
corridoio|korriˈdojo|коридор|Il corridoio è lungo.|The corridor is long.|Коридор длинный.
soffitto|sofˈfitto|потолок|Il soffitto è alto.|The ceiling is high.|Потолок высокий.
pavimento|paviˈmento|пол|Il pavimento è freddo.|The floor is cold.|Пол холодный.
tetto|ˈtetto|крыша|Dal tetto si vede il mare.|From the roof you can see the sea.|С крыши видно море.
muro|ˈmuːro|стена|Un quadro sul muro.|A picture on the wall.|Картина на стене.
palazzo|paˈlattso|дом, здание|Questo palazzo è storico.|This building is historic.|Это здание историческое.
albergo|alˈbɛrɡo|гостиница|L'albergo è vicino alla stazione.|The hotel is near the station.|Гостиница рядом с вокзалом.
moto|ˈmɔto|мотоцикл|Il ragazzo ha una moto nuova.|The boy has a new motorbike.|У парня новый мотоцикл.
tassì|tasˈsi|такси|Prendo un tassì per l'aeroporto.|I take a taxi to the airport.|Я беру такси в аэропорт.
tram|tram|трамвай|Il tram passa ogni dieci minuti.|The tram runs every ten minutes.|Трамвай ходит каждые десять минут.
metropolitana|metroplitaˈna|метро|La metropolitana è veloce.|The underground is fast.|Метро быстрое.
nave|ˈnaːve|корабль|La nave parte dal porto.|The ship leaves from the port.|Корабль отходит из порта.
porto|ˈpɔrto|порт, гавань|Il porto è pieno di navi.|The port is full of ships.|Порт полон кораблей.
volo|ˈvɔːlo|рейс, полёт|Il volo è in ritardo.|The flight is delayed.|Рейс задерживается.
passeggero|pasˈsɛddʒero|пассажир|Il passeggero ha una valigia.|The passenger has a suitcase.|У пассажира чемодан.
pilota|piˈlɔta|пилот|Il pilota parla ai passeggeri.|The pilot talks to the passengers.|Пилот разговаривает с пассажирами.
binario|biˈnaːrjo| платформа|Il treno parte dal binario sette.|The train leaves from platform seven.|Поезд отходит с седьмой платформы.
orario|oˈraːrjo|расписание; часы|Guardo l'orario dei treni.|I look at the train timetable.|Я смотрю расписание поездов.
benzina|benˈdziːna|бензин|Serve benzina per il viaggio.|The journey needs petrol.|Для поездки нужен бензин.
angolo|ˈaŋɡolo|угол|Il bar è all'angolo.|The bar is on the corner.|Бар на углу.
semaforo|ˈsemaforo|светофор|Il semaforo è rosso.|The traffic light is red.|Светофор красный.
traffico|traˈffiːko|движение, пробки|C'è molto traffico stamattina.|There is a lot of traffic this morning.|Сегодня утром большие пробки.
parcheggio|parˈkeddʒo|парковка|Il parcheggio è pieno.|The car park is full.|Парковка полная.
monumento|monuˈmento|памятник|Il monumento è al centro della piazza.|The monument is in the middle of the square.|Памятник в центре площади.
fontana|fonˈtana|фонтан|Ci sediamo vicino alla fontana.|We sit near the fountain.|Мы садимся у фонтана.
torre|ˈtorre|башня|La torre è molto alta.|The tower is very tall.|Башня очень высокая.
cane|ˈkaːne|собака|Il cane gioca nel giardino.|The dog plays in the garden.|Собака играет в саду.
gatto|ˈɡatto|кот, кошка|Il gatto dorme sul divano.|The cat sleeps on the sofa.|Кот спит на диване.
cavallo|kaˈvallo|конь, лошадь|Il cavallo corre nel campo.|The horse runs in the field.|Конь бежит в поле.
mucca|ˈmukka|корова|Le mucche sono nel prato.|The cows are in the meadow.|Коровы на лугу.
uccello|utˈtʃɛllo|птица|Un uccello canta alla finestra.|A bird sings at the window.|Птица поёт у окна.
farfalla|farˈfalla|бабочка|Una farfalla vola nel giardino.|A butterfly flies in the garden.|Бабочка летает в саду.
ape|ˈaːpe|пчела|Le api fanno il miele.|Bees make honey.|Пчёлы делают мёд.
albero|ˈalbeːro|дерево|L'albero è molto vecchio.|The tree is very old.|Дерево очень старое.
fiore|ˈfjoːre|цветок|Ho comprato dei fiori per lei.|I bought flowers for her.|Я купил ей цветы.
foglia|ˈfoʎʎa|лист|La foglia è verde d'estate.|The leaf is green in summer.|Лист летом зелёный.
bosco|ˈbɔsko|лес|Camminiamo nel bosco.|We walk in the wood.|Мы гуляем в лесу.
foresta|foˈrɛsta|лес (большой)|La foresta è piena di uccelli.|The forest is full of birds.|Лес полон птиц.
collina|kolˈliːna|холм|La casa è su una collina.|The house is on a hill.|Дом на холме.
valle|ˈvalle|долина|La valle è verde e tranquilla.|The valley is green and quiet.|Долина зелёная и тихая.
sabbia|ˈsabbja|песок|La sabbia è calda al sole.|The sand is warm in the sun.|Песок тёплый на солнце.
pietra|ˈpjetra|камень|Il vecchio muro è di pietra.|The old wall is made of stone.|Старая стена из камня.
terra|ˈtɛrra|земля|La terra è secca d'estate.|The ground is dry in summer.|Земля летом сухая.
fuoco|ˈfwɔːko|огонь|Il fuoco nella stufa è caldo.|The fire in the stove is warm.|Огонь в печи тёплый.
aria|ˈaːria|воздух|L'aria di montagna è pulita.|The mountain air is clean.|Горный воздух чистый.
nebbia|ˈnebbja|туман|La nebbia copre la città.|The fog covers the city.|Туман покрывает город.
ghiaccio|ˈɡjattʃo|лёд|Il lago è coperto di ghiaccio.|The lake is covered with ice.|Озеро покрыто льдом.
minuto|miˈnuːto|минута|Aspetta un minuto, per favore.|Wait a minute, please.|Подожди минуту, пожалуйста.
secondo|seˈkondo|секунда; второй|Un secondo, sto arrivando.|One second, I am coming.|Секунду, я иду.
orologio|oroˈlɔːdʒo|часы|Il mio orologio va avanti.|My watch is fast.|Мои часы спешат.
infermiere|inferˈmjɛːre|медбрат, медсестра|L'infermiere lavora di notte.|The nurse works at night.|Медбрат работает ночью.
avvocato|avvoˈkato|адвокат|L'avvocato legge il documento.|The lawyer reads the document.|Адвокат читает документ.
ingegnere|indʒiˈɲɛːre|инженер|Mio padre è ingegnere.|My father is an engineer.|Мой отец инженер.
cuoco|ˈkwɔːko|повар|Il cuoco prepara la cena.|The cook makes dinner.|Повар готовит ужин.
cameriere|kameˈrjeːre|официант|Il cameriere porta il conto.|The waiter brings the bill.|Официант приносит счёт.
meccanico|mekˈkaːniko|механик|Il meccanico ripara la macchina.|The mechanic repairs the car.|Механик чинит машину.
artista|arˈtista|художник; артист|L'artista dipinge un quadro.|The artist paints a picture.|Художник пишет картину.
scrittore|skriˈttore|писатель|Lo scrittore scrive un libro nuovo.|The writer writes a new book.|Писатель пишет новую книгу.
cantante|kanˈtante|певец, певица|Il cantante ha una bella voce.|The singer has a beautiful voice.|У певца красивый голос.
attore|atˈtoːre|актёр|L'attore è nel film nuovo.|The actor is in the new film.|Актёр в новом фильме.
poliziotto|politˈtsɔtto|полицейский|Il poliziotto aiuta le persone.|The policeman helps people.|Полицейский помогает людям.
postino|poˈstiːno|почтальон|Il postino porta le lettere.|The postman brings the letters.|Почтальон приносит письма.
telefono|teˈlɛfono|телефон|Il mio telefono è scarico.|My phone is out of battery.|Мой телефон разряжен.
cellulare|tʃelluˈlare|мобильный телефон|Il tuo cellulare suona.|Your mobile phone is ringing.|Твой мобильный звонит.
computer|komˈpjuter|компьютер|Lavoro al computer tutto il giorno.|I work at the computer all day.|Я работаю за компьютером весь день.
televisore|televiˈzoːre|телевизор|Il televisore è nel salotto.|The television is in the living room.|Телевизор в гостиной.
radio|ˈraːdjo|радио|Ascolto la radio in macchina.|I listen to the radio in the car.|Я слушаю радио в машине.
messaggio|mesˈsaddʒo|сообщение|Ho ricevuto un tuo messaggio.|I have received a message from you.|Я получил от тебя сообщение.
email|ˈiːmeil|электронное письмо|Ti mando un'email stasera.|I will send you an email tonight.|Я отправлю тебе письмо сегодня вечером.
lettera|ˈlettera|письмо|Scrivo una lettera alla nonna.|I write a letter to grandmother.|Я пишу письмо бабушке.
pacco|ˈpakko|посылка, пакет|Il pacco è arrivato stamattina.|The parcel arrived this morning.|Посылка пришла сегодня утром.
indirizzo|indiˈrittso|адрес|Scrivimi il tuo indirizzo.|Write me your address.|Напиши мне свой адрес.
documento|dokumenˈto|документ|Il documento è nella borsa.|The document is in the bag.|Документ в сумке.
passaporto|passaˈpɔrto|паспорт|Il passaporto è valido dieci anni.|The passport is valid for ten years.|Паспорт действителен десять лет.
fotografia|fotograˈfia|фотография|Una fotografia dei nonni.|A photograph of the grandparents.|Фотография бабушки и дедушки.
foto|ˈfɔːto|фото|Guardo le foto delle vacanze.|I look at the holiday photos.|Я смотрю фото из отпуска.
compleanno|kompleˈanno|день рождения|Buon compleanno, Marco!|Happy birthday, Marco!|С днём рождения, Марко!
sorpresa|sorˈpreːza|сюрприз|Che bella sorpresa vedere te!|What a nice surprise to see you!|Какой приятный сюрприз — видеть тебя!
matrimonio|matriˈmonjo|свадьба; брак|Il matrimonio è a giugno.|The wedding is in June.|Свадьба в июне.
vacanza|vaˈkantsa| отпуск|Le vacanze iniziano domani.|The holidays start tomorrow.|Каникулы начинаются завтра.
riposo|riˈpoːzo| отдых|Dopo il lavoro mi riposo un'ora.|After work I rest for an hour.|После работы я отдыхаю час.
sogno|ˈsoɲɲo|сон, мечта|Ho fatto un bel sogno.|I had a nice dream.|Мне приснился хороший сон.
verità|veriˈta|правда|La verità è importante.|The truth is important.|Правда важна.
bugia|buˈdʒia|ложь|Non dire bugie.|Don't tell lies.|Не говори лжи.
pace|ˈpaːtʃe|мир, покой|Il paese vuole la pace.|The country wants peace.|Страна хочет мира.
guerra|ˈɡwɛrra|война|Il nonno racconta la guerra.|Grandfather tells about the war.|Дедушка рассказывает о войне.
fortuna|forˈtuna| удача|Buona fortuna all'esame!|Good luck at the exam!|Удачи на экзамене!
problema|proˈblɛma|проблема|Ho un problema con il computer.|I have a problem with the computer.|У меня проблема с компьютером.
servizio|serˈvittsjo|сервис, услуга|Il servizio del ristorante è buono.|The restaurant service is good.|Сервис в ресторане хороший.
stipendio|stiˈpɛndjo|зарплата|Lo stipendio arriva il primo del mese.|The salary arrives on the first of the month.|Зарплата приходит первого числа.
riunione|riuˈnjoːne| собрание|La riunione inizia alle nove.|The meeting starts at nine.|Собрание начинается в девять.
progetto|proˈdʒɛtto|проект|Il progetto è quasi finito.|The project is almost finished.|Проект почти закончен.
ordine|ˈordine|порядок; заказ|Ho fatto un ordine online.|I placed an order online.|Я сделал заказ онлайн.
notizia|noˈtittsja| новость|Che bella notizia!|What good news!|Какая хорошая новость!
rivista|riˈvista|журнал|Compro una rivista in gareda.|I buy a magazine at the station.|Я покупаю журнал на вокзале.
zaino|ˈdzaino|рюкзак|Il mio zaino è pesante.|My backpack is heavy.|Мой рюкзак тяжёлый.
quaderno|kwaˈdeːrno|тетрадь|Il quaderno è nella borsa.|The notebook is in the bag.|Тетрадь в сумке.
matita|maˈtiːta|карандаш|La matita è sul tavolo.|The pencil is on the table.|Карандаш на столе.
voto|ˈvɔːto|оценка; голос|Il voto dell'esame è alto.|The exam mark is high.|Оценка за экзамен высокая.
compito|ˈkompito|домашнее задание; задача|Il compito è difficile.|The homework is difficult.|Домашнее задание трудное.
grammatica|gramˈmatika|грамматика|La grammatica italiana non è facile.|Italian grammar is not easy.|Итальянская грамматика непростая.
verbo|ˈvɛrbo|глагол|Questo verbo è irregolare.|This verb is irregular.|Этот глагол неправильный.
dizionario|dittsjoˈnaːrjo|словарь|Cerca la parola nel dizionario.|Look up the word in the dictionary.|Найди слово в словаре.
maestro|maˈeːstro|учитель (в школе)|Il maestro spiega la lezione.|The teacher explains the lesson.|Учитель объясняет урок.
forza|ˈfortsa|сила; смелость (восклицание)|Hai molta forza!|You are very strong!|У тебя большая сила!
coraggio|koˈraddʒo|смелость, храбрость|Coraggio, la fine è vicina!|Courage, the end is near!|Смелее, конец близко!
pazienza|paˈtsjɛntsa|терпение|Serve pazienza per imparare.|Learning needs patience.|Для учёбы нужно терпение.
paura|paˈuːra|страх|Ho paura del buio.|I am afraid of the dark.|Я боюсь темноты.
rabbia|ˈrabbja|злость, гнев|La sua risposta è piena di rabbia.|His answer is full of anger.|Его ответ полон злости.
gioia|ˈdʒɔːja|радость|La sua voce è piena di gioia.|His voice is full of joy.|Его голос полон радости.
dolore|doˈloːre|боль|Il dolore passa presto.|The pain passes quickly.|Боль быстро проходит.
speranza|speˈrantsa|надежда|C'è sempre speranza.|There is always hope.|Всегда есть надежда.
desiderio|deziˈdeːrjo|желание|Il mio desiderio è un viaggio.|My wish is a journey.|Моё желание — путешествие.
bisogno|biˈsoɲɲo|нужда, необходимость|Ho bisogno di aiuto.|I need help.|Мне нужна помощь.
aiuto|aˈjuːto|помощь|Grazie per il tuo aiuto.|Thanks for your help.|Спасибо за помощь.
consiglio|konˈsiʎʎo|совет|Il consiglio del dottore è utile.|The doctor's advice is useful.|Совет врача полезен.
promessa|proˈmɛssa|обещание|Una promessa è una promessa.|A promise is a promise.|Обещание есть обещание.
errore|eˈrroːre|ошибка|L'errore è nel primo capoverso.|The mistake is in the first paragraph.|Ошибка в первом абзаце.
esercizio|ezerˈtʃittsjo|упражнение|Facciamo un esercizio di grammatica.|We do a grammar exercise.|Мы делаем упражнение по грамматике.
ombrello|omˈbrello|зонт|Prendo l'ombrello perché piove.|I take the umbrella because it rains.|Я беру зонт, потому что идёт дождь.
occhiali|okˈkjaːli|очки|Ho bisogno dei miei occhiali.|I need my glasses.|Мне нужны мои очки.
borsa|ˈborsa|сумка|La borsa è sulla sedia.|The bag is on the chair.|Сумка на стуле.
portafoglio|portafɔˈʎʎo|кошелёк|Il portafoglio è in tasca.|The wallet is in the pocket.|Кошелёк в кармане.
moneta|moˈneːta|монета|Una moneta è sul pavimento.|A coin is on the floor.|Монета на полу.
quadro|ˈkwadro|картина; квадрат|Il quadro è sopra il divano.|The picture is above the sofa.|Картина над диваном.
specchio|ˈspɛkkjo|зеркало|Guardo lo specchio prima di uscire.|I look in the mirror before going out.|Я смотрю в зеркало перед выходом.
sapone|saˈpoːne|мыло|Il sapone è nel bagno.|The soap is in the bathroom.|Мыло в ванной.
asciugamano|aʃʃuɡaˈmaːno|полотенце|L'asciugamano è pulito.|The towel is clean.|Полотенце чистое.
cuscino|kuʃˈʃiːno|подушка|Il cuscino è morbido.|The pillow is soft.|Подушка мягкая.
coperta|koˈperta|одеяло|La coperta è sul letto.|The blanket is on the bed.|Одеяло на кровати.
divano|diˈvaːno|диван|Il gatto dorme sul divano.|The cat sleeps on the sofa.|Кот спит на диване.
tappeto|ˈtappeto|ковёр|Il tappeto è nuovo.|The carpet is new.|Ковёр новый.
aprire|aˈpriːre|открывать|Apri la finestra, per favore.|Open the window, please.|Открой окно, пожалуйста.
chiudere|ˈkjuːdere|закрывать|Chiudi la porta a chiave.|Lock the door.|Закрой дверь на ключ.
comprare|komˈpraːre|покупать|Compro il pane ogni giorno.|I buy bread every day.|Я покупаю хлеб каждый день.
vendere|ˈvɛndere|продавать|Vendono frutta fresca al mercato.|They sell fresh fruit at the market.|Они продают свежие фрукты на рынке.
pagare|paˈɡaːre|платить|Paghi il conto alla cassa.|You pay the bill at the till.|Ты платишь счёт на кассе.
guidare|ɡwiˈdaːre|водить машину|Guido piano nel centro.|I drive slowly in the centre.|Я еду медленно в центре.
camminare|kammiˈnaːre| гулять|Camminiamo dopo la cena.|We walk after dinner.|Мы гуляем после ужина.
correre|ˈkorrere|бежать|Il cane corre nel parco.|The dog runs in the park.|Собака бегает в парке.
volare|voˈlaːre|летать|Gli uccelli volano a sud.|The birds fly south.|Птицы летят на юг.
nuotare|nwoˈtaːre|плавать|Nuoto ogni mattina d'estate.|I swim every morning in summer.|Летом я плаваю каждое утро.
portare|porˈtaːre|носить; приносить|Porto il libro alla biblioteca.|I take the book to the library.|Я несу книгу в библиотеку.
lasciare|laʃˈʃaːre|оставлять; покидать|Lascio le chiavi sul tavolo.|I leave the keys on the table.|Я оставляю ключи на столе.
aiutare|aˈjwaːre|помогать|Aiuto mia madre in cucina.|I help my mother in the kitchen.|Я помогаю маме на кухне.
servire|serˈviːre|служить; быть нужным|Questo strumento serve a tagliare.|This tool is used for cutting.|Этот инструмент служит для резки.
tenere|teˈneːre|держать|Tengo il libro in mano.|I hold the book in my hand.|Я держу книгу в руке.
imparare|impaˈraːre|учиться, выучивать|Imparo parole nuove ogni giorno.|I learn new words every day.|Я учу новые слова каждый день.
studiare|stuˈdjaːre|учиться, изучать|Studiano inglese alla sera.|They study English in the evening.|Они учат английский вечером.
aspettare|aspetˈtaːre|ждать|Aspetto il treno al bar.|I wait for the train at the bar.|Я жду поезд в баре.
tornare|torˈnaːre|возвращаться|Torno a casa alle sei.|I come home at six.|Я возвращаюсь домой в шесть.
piacere|pjaˈtʃeːre| нравиться|Mi piace la musica italiana.|I like Italian music.|Мне нравится итальянская музыка.
sembrare|semˈbraːre|казаться|Sembra che piova presto.|It seems it will rain soon.|Кажется, скоро пойдёт дождь.
perdere|ˈperdere|терять|Perdo sempre le chiavi.|I always lose the keys.|Я вечно теряю ключи.
riuscire|riuʃˈʃiːre|удаваться, справляться|Riesco a capire la lezione.|I manage to understand the lesson.|Мне удаётся понять урок.
morire|moˈriːre|умирать|Il vecchio cane muore.|The old dog dies.|Старый пёс умирает.
nascere|ˈnaʃʃere|рождаться|Sono nato a Torino.|I was born in Turin.|Я родился в Турине.
vincere|ˈvintʃere|побеждать|La nostra squadra vince la partita.|Our team wins the match.|Наша команда выигрывает матч.
dimenticare|dimentˈkaːre|забывать|Dimentico sempre i nomi.|I always forget names.|Я вечно забываю имена.
svegliarsi|zveʎˈʎarsi|просыпаться|Mi sveglio alle sette.|I wake up at seven.|Я просыпаюсь в семь.
chiamarsi|kjamˈmarsi|называться, зваться|Mi chiamo Luca e lei Anna.|My name is Luca and hers is Anna.|Меня зовут Лука, а её — Анна.
sentirsi|senˈtirsi|чувствовать себя|Oggi mi sento bene.|I feel well today.|Сегодня я хорошо себя чувствую.
divertirsi|diverˈtirsi| веселиться|Ci divertiamo alla festa.|We enjoy ourselves at the party.|Мы весело проводим время на вечеринке.
alzarsi|alˈtsarsi|подниматься, вставать|Mi alzo presto la mattina.|I get up early in the morning.|Утром я встаю рано.
sedersi|seˈdersi|садиться|Vi sedete qui, per favore.|Sit here, please.|Сядьте здесь, пожалуйста.
mandare|manˈdaːre|отправлять|Mando una lettera alla zia.|I send a letter to my aunt.|Я отправляю письмо тёте.
ricevere|ritʃeˈveːre|получать|Ricevo un pacco dal postino.|I receive a parcel from the postman.|Я получаю посылку от почтальона.
mostrare|moˈstraːre|показывать|Mi mostri la tua casa.|Show me your house.|Покажи мне свой дом.
offrire|ofˈfriːre| предлагать|Offro un caffè a Luca.|I offer Luca a coffee.|Я предлагаю Луке кофе.
accettare|attʃetˈtaːre|принимать, соглашаться|Accetto la tua proposta.|I accept your proposal.|Я принимаю твоё предложение.
rifiutare|rifjuˈtaːre|отказывать, отклонять|Rifiuto di uscire stasera.|I refuse to go out tonight.|Я отказываюсь идти гулять сегодня.
ottenere|otteˈneːre|получать, добывать|Ottengo buoni risultati.|I get good results.|Я получаю хорошие результаты.
ripetere|riˈpetere|повторять|Ripeto la frase per il professore.|I repeat the sentence for the professor.|Я повторяю фразу для профессора.
costruire|kostruˈiːre|строить|Costruiscono una casa nuova.|They are building a new house.|Они строят новый дом.
cucinare|kutʃiˈnaːre|готовить еду|Cucino la pasta per pranzo.|I cook pasta for lunch.|Я готовлю пасту на обед.
cantare|kanˈtaːre|петь|Cantiamo insieme alla festa.|We sing together at the party.|Мы поём вместе на вечеринке.
suonare|swoˈnaːre|играть на инструменте; звонить|Suono il piano ogni sera.|I play the piano every evening.|Я играю на пианино каждый вечер.
ballare|balˈlaːre|танцевать|Balliamo tutta la notte.|We dance all night.|Мы танцуем всю ночь.
disegnare|dizeˈɲɲaːre|рисовать|Il bambino disegna un albero.|The child draws a tree.|Ребёнок рисует дерево.
tagliare|taˈʎʎaːre|резать|Taglio il pane per cena.|I cut the bread for dinner.|Я режу хлеб на ужин.
cambiare|kamˈbjaːre| менять|Cambio i miei piani per domani.|I am changing my plans for tomorrow.|Я меняю свои планы на завтра.
scegliere|ʃeˈʎʎeːre|выбирate|Scegli il tuo regalo.|Choose your present.|Выбирай свой подарок.
decidere|deˈtʃidere|решать|Decidiamo il programma insieme.|We decide the programme together.|Мы вместе решаем программу.
spiegare|spjeˈɡaːre|объяснять|Il maestro spiega la regola.|The teacher explains the rule.|Учитель объясняет правило.
descrivere|deʃˈʃriːvere|описывать|Descrivo la mia città.|I describe my city.|Я описываю свой город.
tradurre|traˈdurrere|переводить|Traduco il testo dal francese.|I translate the text from French.|Я перевожу текст с французского.
promettere|proˈmettere|обещать|Prometto di tornare presto.|I promise to come back soon.|Обещаю вернуться скоро.
permettere|perˈmettere|позволять|Il tempo non lo permette.|The weather does not allow it.|Погода этого не позволяет.
risolvere|rizoˈlvere|решать (проблему)|Risolvero il problema domani.|We will solve the problem tomorrow.|Мы решим проблему завтра.
condividere|kondiˈviːdere|делиться|Condivido la foto con te.|I share the photo with you.|Я делюсь с тобой фото.
aggiungere|addʒunˈdʒeːre|добавлять|Aggiungo sale alla zuppa.|I add salt to the soup.|Я добавляю соль в суп.
togliere|ˈtoʎʎeːre| убирать|Togli il sale dalla tavola.|Remove the salt from the table.|Убери соль со стола.
indossare|inˈdossare|надевать|Indosso un maglione caldo.|I put on a warm sweater.|Я надеваю тёплый свитер.
lavare|laˈvaːre|мыть, стирать|Lavo i piatti dopo la cena.|I wash the dishes after dinner.|Я мою посуду после ужина.
pulire|puˈliːre|чистить|Pulisco la casa il sabato.|I clean the house on Saturdays.|Я убираю дом по субботам.
ordinare|ordiˈnaːre|упорядочивать; заказывать|Ordino i libri sul tavolo.|I arrange the books on the table.|Я расставляю книги на столе.
riposarsi|ripoˈzarsi|отдыхать|Riposo un'ora dopo pranzo.|I rest for an hour after lunch.|Я отдыхаю час после обеда.
visitare|viziˈtaːre|посещать|Visitiamo il museo di Milano.|We visit the museum of Milan.|Мы посещаем музей в Милане.
invitare|invitaːre|приглашать|Invito gli amici a casa.|I invite friends home.|Я приглашаю друзей домой.
ringraziare|rinɡratˈtsjaːre|благодарить|Ringrazio tutti per l'aiuto.|I thank everyone for the help.|Я благодарю всех за помощь.
salutare|saluˈtaːre|приветствовать|Saluto il vicino ogni mattina.|I greet the neighbour every morning.|Я здороваюсь с соседом каждое утро.
incontrare|inkonˈtraːre| встречать|Incontro Marco al bar.|I meet Marco at the bar.|Я встречаю Марко в баре.
ridere|ˈriːdere|смеяться|Ridiamo della tua storia.|We laugh at your story.|Мы смеёмся над твоей историей.
piangere|ˈpjaŋdʒere|плакать|Il bambino piange molto.|The child cries a lot.|Ребёнок много плачет.
urlare|urˈlaːre|кричать|Il tifoso urla allo stadio.|The fan shouts at the stadium.|Фанат кричит на стадионе.
sognare|soˈɲɲaːre|видеть сны; мечтать|Sogno un viaggio in Italia.|I dream of a journey to Italy.|Я мечтаю о поездке в Италию.
spedire|speˈdiːre|отправлять (посылку)|Spedisco il pacco domani.|I send the parcel tomorrow.|Я отправлю посылку завтра.
prenotare|prenotˈtaːre|бронировать|Prenoto un tavolo per due.|I book a table for two.|Я бронирую столик на двоих.
firmare|firˈmaːre|подписывать|Firmi qui, per favore.|Sign here, please.|Подпишите здесь, пожалуйста.
copiare|koˈpjaːre|копировать|Copio la frase nel quaderno.|I copy the sentence into the notebook.|Я переписываю фразу в тетрадь.
cenare|tʃeˈnaːre|ужинать|Ceniamo alle otto di sera.|We have dinner at eight in the evening.|Мы ужинаем в восемь вечера.
sposarsi|spoˈzarsi|жениться, выходить замуж|Si sposano a settembre.|They are getting married in September.|Они женятся в сентябре.
esistere|eˈzistere|существовать|Non credo che i draghi esistano.|I do not believe dragons exist.|Я не верю, что драконы существуют.
bastare|baˈstaːre|быть достаточным|Un panino basta per me.|One sandwich is enough for me.|Одного бутерброда мне достаточно.
mancare|manˈkaːre|не хватать; пропускать|Mi mancano due parole.|I am missing two words.|Мне не хватает двух слов.
contenere|konteˈneːre|содержать|La bottiglia contiene un litro.|The bottle contains one litre.|Бутылка содержит литр.
alzare|alˈtsaːre|поднимать|Alzo la mano per rispondere.|I raise my hand to answer.|Я поднимаю руку, чтобы ответить.
abbassare|abbasˈsaːre|опускать|Abbassi il volume, per favore.|Lower the volume, please.|Убавь громкость, пожалуйста.
raccogliere|rakˈkoʎʎeːre|собирать|Raccogliamo le foglie in autunno.|We collect the leaves in autumn.|Мы собираем листья осенью.
gettare|dʒetˈtaːre|бросать|Getta la carta nel cestino.|Throw the paper into the bin.|Брось бумагу в корзину.
spingere|ˈspindʒere|толкать|Spingo la porta ma è chiusa.|I push the door but it is closed.|Я толкаю дверь, но она закрыта.
tirare|tiˈraːre|тянуть|Tira la corda con forza.|Pull the rope with strength.|Тяни верёвку с силой.
rompere|ˈrompere| ломать|Il bambino rompe il giocattolo.|The child breaks the toy.|Ребёнок ломает игрушку.
riparare|ripaˈraːre|чинить|Riparo il computer da solo.|I repair the computer myself.|Я чиню компьютер сам.
stesso|ˈstɛsso|тот же самый|Abitiamo nello stesso palazzo.|We live in the same building.|Мы живём в том же доме.
altro|ˈaltro|другой, иной|Vorrei un altro caffè.|I would like another coffee.|Я хотел бы ещё один кофе.
ogni|ˈɔɲɲi|каждый|Ogni mattina bevo un caffè.|Every morning I drink a coffee.|Каждое утро я пью кофе.
tutti|ˈtutti| все|Tutti gli studenti sono presenti.|All the students are present.|Все студенты присутствуют.
tanto|ˈtanto|много; столько|Bevi troppa aranciata, tanta zucchero!|You drink too much soda, so much sugar!|Ты пьёшь много газировки, столько сахара!
troppo|ˈtrɔppo|слишком, слишком много|Questo maglione è troppo caldo.|This sweater is too warm.|Этот свитер слишком тёплый.
meno|ˈmeːno|меньше|Vorrei meno zucchero nel tè.|I would like less sugar in the tea.|Я хотел бы меньше сахара в чае.
meglio|ˈmɛʎʎo|лучше|Oggi mi sento meglio.|I feel better today.|Сегодня я чувствую себя лучше.
peggio|ˈpɛddʒo|хуже|Il tempo va di peggio in peggio.|The weather is getting worse and worse.|Погода становится всё хуже.
migliore|miˈʎʎore|лучший|Questo ristorante è il migliore.|This restaurant is the best.|Этот ресторан — лучший.
peggiore|peˈddʒore|худший|È il giorno peggiore della settimana.|It is the worst day of the week.|Это худший день недели.
famoso|faˈmoːzo|известный, знаменитый|Questo attore è molto famoso.|This actor is very famous.|Этот актёр очень известен.
libero|ˈliːbero|свободный, занят (нет)|Sono libero domani sera.|I am free tomorrow evening.|Я свободен завтра вечером.
occupato|okkuˈpato|занятой; занято (линия)|La linea è occupata.|The line is busy.|Линия занята.
addormentato|addormenˈtato|уснувший|Il bambino è già addormentato.|The child is already asleep.|Ребёнок уже уснул.
malato|maˈlato|больной|Marco è malato oggi.|Marco is ill today.|Марко сегодня болен.
contento|konˈtɛnto|довольный, радостный|Sono contento di vederti.|I am glad to see you.|Я рад тебя видеть.
arrabbiato|arrabˈbjaːto|злой, сердитый|Il capo è arrabbiato oggi.|The boss is angry today.|Шеф сегодня сердитый.
nervoso|nerˈvoːzo|нервный|Sono nervoso prima dell'esame.|I am nervous before the exam.|Я нервничаю перед экзаменом.
tranquillo|tranˈkwillo|спокойный|Il mare è tranquillo.|The sea is calm.|Море спокойное.
simpatico|simˈpatiko|приятный, милый|Il tuo collega è simpatico.|Your colleague is nice.|Твой коллега приятный.
antipatico|antiˈpatiko|неприятный|Il vicino è antipatico.|The neighbour is unpleasant.|Сосед неприятный.
gentile|dʒenˈtiːle|добрый, любезный|La signora è molto gentile.|The lady is very kind.|Дама очень любезна.
serio|ˈseːrjo|серьёзный|Il progetto è molto serio.|The project is very serious.|Проект очень серьёзный.
divertente|diverˈtɛnte| весёлый|Questo film è divertente.|This film is funny.|Этот фильм весёлый.
utile|uˈtiːle|полезный|Il tuo consiglio è molto utile.|Your advice is very useful.|Твой совет очень полезен.
inutile|iˈnutile|бесполезный|È inutile aspettare qui.|It is useless to wait here.|Бесполезно ждать здесь.
necessario|netʃesˈsaːrjo|необходимый|È necessario un passaporto.|A passport is necessary.|Необходим паспорт.
possibile|posˈsiːbile|возможный|È possibile prenotare online.|It is possible to book online.|Возможно бронировать онлайн.
impossibile|imposˈsiːbile|невозможный|È impossibile capire tutto.|It is impossible to understand everything.|Невозможно понять всё.
speciale|speˈtʃjaːle|особый, специальный|Oggi è un giorno speciale.|Today is a special day.|Сегодня особенный день.
normale|norˈmaːle|нормальный, обычный|È una giornata normale.|It is a normal day.|Это обычный день.
moderno|moˈdeːrno|современный|Questo museo è molto moderno.|This museum is very modern.|Этот музей очень современный.
antico|anˈtiːko|древний, старинный|La chiesa è molto antica.|The church is very ancient.|Церковь очень древняя.
delizioso|delitˈtsjoːzo|очень вкусный|La pasta è deliziosa.|The pasta is delicious.|Паста очень вкусная.
salato|saˈlato|солёный|La zuppa è troppo salata.|The soup is too salty.|Суп слишком солёный.
amaro|aˈmaːro|горький|Il caffè senza zucchero è amaro.|Coffee without sugar is bitter.|Кофе без сахара горький.
fresco|ˈfrɛsko| свежий|Il pane è ancora fresco.|The bread is still fresh.|Хлеб ещё свежий.
bagnato|baɲˈɲato|мокрый|I pantaloni sono bagnati.|The trousers are wet.|Брюки мокрые.
asciutto|aʃˈʃutto|сухой|La strada è asciutta.|The road is dry.|Дорога сухая.
pesante|peˈzante|тяжёлый|Questa valigia è pesante.|This suitcase is heavy.|Этот чемодан тяжёлый.
leggero|leˈdʒeːro|лёгкий|Il libro è leggero.|The book is light.|Книга лёгкая.
stretto|ˈstrɛtto|узкий|Il corridoio è stretto.|The corridor is narrow.|Коридор узкий.
largo|ˈlarɡo|широкий|La strada è larga.|The road is wide.|Дорога широкая.
profondo|proˈfondo|глубокий|Il lago è molto profondo.|The lake is very deep.|Озеро очень глубокое.
sottile|sotˈtiːle|тонкий|La matita è sottile.|The pencil is thin.|Карандаш тонкий.
grosso|ˈɡrosso| толстый|Un libro grosso sul tavolo.|A thick book on the table.|Толстая книга на столе.
giusto|ˈdʒusto|правильный, верный|La tua risposta è giusta.|Your answer is correct.|Твой ответ правильный.
sbagliato|zbaˈʎʎato|неправильный|Il numero è sbagliato.|The number is wrong.|Номер неправильный.
esatto|eˈzatto|точный|L'indirizzo è esatto.|The address is exact.|Адрес точный.
appena|apˈpeːna|только что; как только|Ho appena finito il lavoro.|I have just finished the work.|Я только что закончил работу.
indietro|inˈdjɛtro| назад|Il palazzo è un po' più indietro.|The building is a bit further back.|Дом немного дальше назад.
davanti|daˈvanti| перед|Il bar è davanti alla stazione.|The bar is in front of the station.|Бар перед вокзалом.
dietro|ˈdjetro|позади, за|Il giardino è dietro la casa.|The garden is behind the house.|Сад за домом.
probabilmente|probabilˈmente|вероятно|Probabilmente piove domani.|Probably it will rain tomorrow.|Вероятно, завтра пойдёт дождь.
purtroppo|purˈtrɔppo|к сожалению|Purtroppo non posso venire.|Unfortunately I cannot come.|К сожалению, я не могу прийти.
almeno|alˈmeːno|по крайней мере|Rispondi almeno alla domanda.|At least answer the question.|Хотя бы ответь на вопрос.
anche|ˈaŋke|тоже, также|Anche io voglio venire.|I also want to come.|Я тоже хочу прийти.
solo|ˈsoːlo|только; один|Resto solo due giorni.|I stay only two days.|Я остаюсь только два дня.
invece|inˈvɛttʃe|вместо; а (напротив)|Lui esce, io invece resto.|He goes out, I instead stay.|Он выходит, я же остаюсь.
allora|alˈlora|тогда; итак|Allora andiamo al cinema!|So we are going to the cinema!|Ну что, идём в кино!
quindi|ˈkwindi|поэтому, итак|È tardi, quindi vado a casa.|It is late, so I go home.|Поздно, поэтому я иду домой.
verso|ˈvɛrso| к|Torno verso le nove.|I come back around nine.|Я возвращаюсь около девяти.
durante|duˈrante|во время|Leggo durante il viaggio.|I read during the journey.|Я читаю во время поездки.
contro|ˈkontro|против; на (о столкновении)|La partita è contro Milano.|The match is against Milan.|Матч против Милана.
senza|ˈsenza|без|Caffè senza zucchero, per favore.|Coffee without sugar, please.|Кофе без сахара, пожалуйста.
circa|ˈtʃirka|приблизительно|Il viaggio dura circa due ore.|The journey lasts about two hours.|Поездка длится около двух часов.
lo stesso|lo ˈstɛsso|то же самое|Prendo lo stesso.|I take the same.|Я возьму то же самое.
un altro|un ˈaltro|ещё один|Un altro caffè, grazie.|Another coffee, thanks.|Ещё один кофе, спасибо.
tante|ˈtante|много (жен. род)|Ho tante domande.|I have many questions.|У меня много вопросов.
tanti|ˈtanti|много (муж. род)|Ci sono tanti libri qui.|There are many books here.|Здесь много книг.
parecchio|paˈrekkjo|довольно много|Ho parecchio lavoro oggi.|I have quite a lot of work today.|У меня довольно много работы сегодня.
latte di soia|ˈlatte di ˈsɔja|соевое молоко|Prendo il latte di soia nel caffè.|I have soy milk in my coffee.|Я беру соевое молоко в кофе.
pane tostato|ˈpane toˈstato|тост, поджаренный хлеб|A colazione mangio il pane tostato.|At breakfast I eat toast.|На завтрак я ем тост.
uova|ˈwɔːva|яйца (мн.)|Compro uova fresche al mercato.|I buy fresh eggs at the market.|Я покупаю свежие яйца на рынке.
marmellata|marmelˈlata|джем, варенье|La marmellata di fragole è dolce.|Strawberry jam is sweet.|Клубничный джем сладкий.
burro|ˈburro|масло сливочное|Metti un po' di burro nella pasta.|Put a bit of butter in the pasta.|Положи немного масла в пасту.
frutta secca|ˈfrutta ˈsekka| орехи|A Natale mangiamo frutta secca.|At Christmas we eat nuts.|На Рождество мы едим орехи.
acqua minerale|ˈakwa mineˈrale|минеральная вода|Un'acqua minerale fresca, per favore.|A cold mineral water, please.|Холодную минеральную воду, пожалуйста.
giocattolo|dʒoˈkattolo|игрушка|Il bambino rompe il giocattolo.|The child breaks the toy.|Ребёнок ломает игрушку.
spettacolo|spetˈtaːkolo|спектакль, представление|Lo spettacolo inizia alle nove.|The show starts at nine.|Представление начинается в девять.
biglietteria|biʎʎetˈteriːa|касса|La biglietteria chiude alle otto.|The ticket office closes at eight.|Касса закрывается в восемь.
spettatore|spettaˈtoːre|зритель|Gli spettatori applaudono.|The spectators applaud.|Зрители аплодируют.
partita|parˈtiːta|матч; партия|La partita finisce a pari.|The match ends in a draw.|Матч заканчивается вничью.
squadra|ˈskwaːdra|команда|La nostra squadra gioca bene.|Our team plays well.|Наша команда играет хорошо.
allenamento|allenamˈento|тренировка|L'allenamento dura due ore.|The training lasts two hours.|Тренировка длится два часа.
gara|ˈɡaːra| соревнование|La gara inizia alle tre.|The race starts at three.|Соревнование начинается в три.
vincitore|vintʃiˈtoːre|победитель|Il vincitore riceve un premio.|The winner receives a prize.|Победитель получает приз.
sconfitta|skonˈfitta|поражение|La sconfitta fa male.|Defeat hurts.|Поражение больно.
punto|ˈpunto|точка; очко; пункт|La nostra squadra fa tre punti.|Our team scores three points.|Наша команда набирает три очка.
meta|ˈmeːta|цель; половина пути|La meta del viaggio è Roma.|The destination of the journey is Rome.|Цель поездки — Рим.
obiettivo|obbetˈtiːvo|цель, задача|Il mio obiettivo è imparare.|My aim is to learn.|Моя цель — научиться.
risultato|rizulˈtato|результат|Il risultato è buono.|The result is good.|Результат хороший.
progresso|proˈɡrɛsso|прогресс|Faccio progressi ogni giorno.|I make progress every day.|Я делаю успехи каждый день.
errori|eˈrroːri|ошибки (мн.)|Gli errori aiutano a imparare.|Mistakes help to learn.|Ошибки помогают учиться.
libreria|libreˈria|книжный магазин|La libreria è in centro.|The bookshop is in the centre.|Книжный магазин в центре.
edicola|ˈedikola|киоск пресы|Compro il giornale all'edicola.|I buy the newspaper at the kiosk.|Я покупаю газету в киоске.
farmacista|farmatˈʃista|аптекарь|Il farmacista consiglia una medicina.|The pharmacist recommends a medicine.|Аптекарь советует лекарство.
malattia|maˈlattia|болезнь|La malattia dura una settimana.|The illness lasts a week.|Болезнь длится неделю.
febbre|ˈfebbre|жар, температура|Il bambino ha la febbre.|The child has a fever.|У ребёнка жар.
raffreddore|raffredˈdoːre|простуда|Ho un raffreddore forte.|I have a bad cold.|У меня сильная простуда.
tosse|ˈtosse|кашель|La tosse dura da tre giorni.|The cough has lasted three days.|Кашель длится три дня.
respiro|reˈspiːro|дыхание|Fai un respiro profondo.|Take a deep breath.|Сделай глубокий вдох.
ambulatorio|ambulatoˈrjo|амбулатория, приёмное отделение|L'ambulatorio apre alle otto.|The outpatient clinic opens at eight.|Амбулатория открывается в восемь.
ricetta|riˈtʃetta|рецепт (мед. и кул.)|Il dottore scrive una ricetta.|The doctor writes a prescription.|Врач выписывает рецепт.
pastiglia|paˈstiʎʎa|таблетка|Prendi una pastiglia con acqua.|Take a tablet with water.|Прими таблетку с водой.
cura|ˈkura|уход, лечение|Il riposo è la migliore cura.|Rest is the best cure.|Отдых — лучшее лечение.
segreteria|seɡreteˈriːa|секретариат; приёмная|Chiamo la segreteria domani.|I will call the office tomorrow.|Я позвоню в приёмную завтра.
segretaria|seɡreˈtaːria|секретарь (жен.)|La segretaria risponde al telefono.|The secretary answers the phone.|Секретарь отвечает на телефон.
appuntamento|appuntaˈmento|назначенная встреча|Ho un appuntamento alle dieci.|I have an appointment at ten.|У меня встреча в десять.
aereoporto|aereˈɔpɔrto|аэропорт (разг.)|L'aereoporto è lontano.|The airport is far away.|Аэропорт далеко.
asciugacapelli|aʃʃuɡakapˈelli|фен|L'asciugacapelli è nel bagno.|The hairdryer is in the bathroom.|Фен в ванной.
cassetto|kasˈsɛtto|ящик (комода)|Le foto sono nel cassetto.|The photos are in the drawer.|Фотографии в ящике.
attrezzo|atˈtrɛddzo|инструмент, снаряжение|L'attrezzo è nel garage.|The tool is in the garage.|Инструмент в гараже.
sedia a sdraio|ˈsɛdja a ˈsdrajo|шезлонг|Una sedia a sdraio in giardino.|A deckchair in the garden.|Шезлонг в саду.
prato|ˈpraːto|луг|Le mucche sono nel prato.|The cows are in the meadow.|Коровы на лугу.
sasso|ˈsasso|камень (булыжник)|Il sasso è nell'acqua.|The stone is in the water.|Камень в воде.
pozzanghera|pottsaŋˈɡera|лужа|Il bambino salta nella pozzanghera.|The child jumps into the puddle.|Ребёнок прыгает в лужу.
nido|ˈniːdo|гнездо|L'uccello costruisce il nido.|The bird builds the nest.|Птица строит гнездо.
grano|ˈɡraːno|зерно, пшеница|Il grano è maturo.|The wheat is ripe.|Пшеница созрела.
raccolta|rakˈkolta|сбор, сборник|La raccolta delle mele è in settembre.|The apple harvest is in September.|Сбор яблок — в сентябре.
sentiero|senˈtjeːro|тропинка|Il sentiero porta al lago.|The path leads to the lake.|Тропинка ведёт к озеру.
bordo|ˈbordo| край|Siamo al bordo della strada.|We are at the edge of the road.|Мы на краю дороги.
confine|konˈfiːne|граница|Il confine è vicino.|The border is near.|Граница близко.
carta geografica|ˈkarta dʒeoˈɡrafika|карта (географическая)|La carta geografica è sul muro.|The map is on the wall.|Карта на стене.
bussola|ˈbussola|компас|La bussola indica il nord.|The compass shows the north.|Компас показывает север.
nord|nɔrd|север|Il nord dell'Italia è industriale.|The north of Italy is industrial.|Север Италии — промышленный.
sud|sud|юг|Il sud ha più sole.|The south has more sun.|На юге больше солнца.
est|est|восток|Il est è verso il mare.|The east is towards the sea.|Восток — в сторону моря.
ovest|oˈvɛst|запад|Il sole tramonta a ovest.|The sun sets in the west.|Солнце садится на западе.
temperatura|temperaˈtura|температура|La temperatura è alta oggi.|The temperature is high today.|Температура сегодня высокая.
gradi|ˈɡraːdi|градусы|Sono trenta gradi in estate.|It is thirty degrees in summer.|Летом тридцать градусов.
ombra|ˈombra|тень|Ci sediamo all'ombra.|We sit in the shade.|Мы садимся в тень.
luce|ˈlutʃe|свет|La luce del sole è forte.|The light of the sun is strong.|Солнечный свет сильный.
soggiorno|sodˈdʒorno|гостиная; пребывание|Il soggiorno è una stanza grande.|The living room is a big room.|Гостиная — большая комната.
salotto|saˈlɔtto|салон, гостиная|Il televisore è nel salotto.|The television is in the living room.|Телевизор в гостиной.
ripostiglio|ripoˈstiʎʎo|кладовка|Le scope sono nel ripostiglio.|The brooms are in the storeroom.|Метлы в кладовке.
cantina|kanˈtiːna|подвал, погреб|Il vino è in cantina.|The wine is in the cellar.|Вино в погребе.
materasso|materˈasso|матрас|Il materasso è nuovo.|The mattress is new.|Матрас новый.
lenzuolo|lenˈtswoːlo|простыня|Il lenzuolo è bianco.|The sheet is white.|Простыня белая.
spazzola|ˈspattsola|щётка|La spazzola è sul tavolo.|The brush is on the table.|Щётка на столе.
secchio|ˈsekkjo|ведро|Il secchio è nel garage.|The bucket is in the garage.|Ведро в гараже.
spazzatura|spatˈtsatura|мусор|La spazzatura è fuori.|The rubbish is outside.|Мусор снаружи.
cestino|tʃesˈtiːno|корзина, мусорное ведро|Getta la carta nel cestino.|Throw the paper into the bin.|Брось бумагу в корзину.
detersivo|deterˈsiːvo|моющее средство|Il detersivo è sotto il lavandino.|The detergent is under the sink.|Моющее средство под раковиной.
lavandino|lavanˈdiːno|раковина (кухонная)|Il piatto è nel lavandino.|The plate is in the sink.|Тарелка в раковине.
frigo|ˈfriːɡo|холодильник|Il latte è nel frigo.|The milk is in the fridge.|Молоко в холодильнике.
forno|ˈforno|духовка, печь|Il pane è nel forno.|The bread is in the oven.|Хлеб в духовке.
pentola|ˈpɛntola|кастрюля|La pentola è sul fuoco.|The pot is on the fire.|Кастрюля на огне.
padella|paˈdella|сковорода|La padella è calda.|The pan is hot.|Сковорода горячая.
cucchiaino|kukkjaˈiːno|чайная ложка|Il cucchiaino è piccolo.|The teaspoon is small.|Чайная ложка маленькая.
tenda|ˈtɛnda|штора, занавеска|Chiudi la tenda, per favore.|Close the curtain, please.|Закрой штору, пожалуйста.
tapparella|tappaˈrɛlla|жалюзи, рольставни|Le tapparelle sono chiuse.|The shutters are closed.|Ставни закрыты.
foglio|ˈfoʎʎo|лист (бумаги)|Un foglio di carta bianca.|A sheet of white paper.|Лист белой бумаги.
busta|ˈbusta|конверт|La busta è sulla scrivania.|The envelope is on the desk.|Конверт на письменном столе.
scrivania|skrivaˈniːa|письменный стол|La lampada è sulla scrivania.|The lamp is on the desk.|Лампа на письменном столе.
lampada|ˈlampada|лампа|La lampada è accesa.|The lamp is on.|Лампа включена.
batteria|batteˈria|батарея, аккумулятор|La batteria del telefono è scarica.|The phone battery is flat.|Батарея телефона разряжена.
caricatore|karikaˈtoːre|зарядное устройство|Il caricatore è nel cassetto.|The charger is in the drawer.|Зарядка в ящике.
auricolari|aurikoˈlari|наушники|Gli auricolari sono nuovi.|The earphones are new.|Наушники новые.
schermo|ˈskermo|экран|Lo schermo è rotto.|The screen is broken.|Экран разбит.
tastiera|tasˈtjeːra|клавиатура|La tastiera è nuova.|The keyboard is new.|Клавиатура новая.
mouse|ˈmauz|мышь (комп.)|Il mouse non funziona.|The mouse does not work.|Мышь не работает.
carta|ˈkarta|бумага; карта (банк.)|Un foglio di carta, per favore.|A sheet of paper, please.|Лист бумаги, пожалуйста.
monete|moˈneːte|монеты (мн.)|Ho solo monete.|I have only coins.|У меня только монеты.
contanti|konˈtanti|наличные|Pago in contanti.|I pay in cash.|Я плачу наличными.
sconto|ˈskonto|скидка|C'è uno sconto del dieci per cento.|There is a ten per cent discount.|Скидка десять процентов.
fattura|fatˈtura|счёт-фактура|La fattura è nella busta.|The invoice is in the envelope.|Счёт в конверте.
bancomat|ban koˈmat|банкомат|Il bancomat è fuori dal banco.|The cash machine is outside the bank.|Банкомат снаружи банка.
carta di credito|ˈkarta di kreˈdiːto|кредитная карта|Pago con la carta di credito.|I pay by credit card.|Я плачу кредитной картой.
risparmio|risparˈmjo| сбережения|Il risparmio è importante.|Saving is important.|Экономия важна.
prestito|preˈstiːto|заём, кредит|Il prestito della banca è caro.|The bank loan is expensive.|Кредит в банке дорогой.
interesse|inteˈrɛsse|интерес; процент|Ho interesse per la musica.|I have an interest in music.|Я интересуюсь музыкой.
scadenza|skaˈdenza|срок окончания|La scadenza è domani.|The deadline is tomorrow.|Срок завтра.
ricarica|riˈkarika|пополнение; зарядка|Una ricarica per il telefono.|A top-up for the phone.|Пополнение для телефона.
sarto|ˈsarto|портной|Il sarto aggiusta i pantaloni.|The tailor adjusts the trousers.|Портной подгоняет брюки.
lavanderia|lavandeˈria|прачечная|La lavanderia è in centro.|The laundry is in the centre.|Прачечная в центре.
taglio|ˈtaʎʎo|стрижка; разрез|Il taglio costa venti euro.|The haircut costs twenty euros.|Стрижка стоит двадцать евро.
barbiere|barˈbjeːre|цирюльник|Il barbiere rade il cliente.|The barber shaves the client.|Цирюльник бреет клиента.
ornamento|ornamˈento|украшение|L'ornamento è di legno.|The ornament is made of wood.|Украшение из дерева.
cavalletto|kavalˈletto|мольберт; подставка|Il cavalletto è nell'angolo.|The easel is in the corner.|Мольберт в углу.
colori|koˈloːri|цвета (мн.)|I colori della casa sono caldi.|The colours of the house are warm.|Цвета дома тёплые.
vernice|verˈnitʃe|краска|La vernice è fresca.|The paint is fresh.|Краска свежая.
pennello|penˈnello|кисть (для краски)|Il pennello è nell'acqua.|The brush is in the water.|Кисть в воде.
tela|ˈteːla|холст|La tela è bianca.|The canvas is white.|Холст белый.
galleria|galleˈria|галерея|La galleria d'arte è famosa.|The art gallery is famous.|Художественная галерея известна.
concerto|konˈtʃɛrto|концерт|Il concerto inizia alle nove.|The concert starts at nine.|Концерт начинается в девять.
palco|ˈpalko|сцена; балкон (театр)|Il cantante è sul palco.|The singer is on the stage.|Певец на сцене.
pubblico|ˈpubbliko|публика, зрители|Il pubblico applaude.|The audience applauds.|Публика аплодирует.
applauso|apˈplaːzo|аплодисменты|Gli applausi sono forti.|The applause is loud.|Аплодисменты громкие.
regista|reˈdʒista|режиссёр|Il regista parla con l'attore.|The director talks to the actor.|Режиссёр разговаривает с актёром.
scena|ˈʃeːna|сцена (эпизод)|La scena finale è emozionante.|The final scene is exciting.|Финальная сцена волнующая.
trama|ˈtraːma|сюжет|La trama del film è semplice.|The plot of the film is simple.|Сюжет фильма простой.
personaggio|persoˈnaddʒo|персонаж|Il personaggio principale è Luca.|The main character is Luca.|Главный персонаж — Лука.
allenatore|allenatoːre|тренер|L'allenatore guarda la squadra.|The coach watches the team.|Тренер смотрит на команду.
campo|ˈkampo|поле; площадка|Il campo da calcio è grande.|The football field is big.|Футбольное поле большое.
palla|ˈpalla|мяч|La palla è nel giardino.|The ball is in the garden.|Мяч в саду.
punteggio|punteˈddʒo|счёт (в игре)|Il punteggio è due a uno.|The score is two to one.|Счёт два — один.
pareggio|paˈreddʒo|ничья|La partita finisce in pareggio.|The match ends in a draw.|Матч заканчивается вничью.
campionato|kampjoˈnato|чемпионат|Il campionato inizia in settembre.|The championship starts in September.|Чемпионат начинается в сентябре.
tifoso|tiˈfoːzo|болельщик|I tifosi cantano allo stadio.|The fans sing at the stadium.|Болельщики поют на стадионе.
medaglia|meˈdaʎʎa|медаль|La medaglia è d'oro.|The medal is made of gold.|Медаль золотая.
premio|ˈprɛmjo|приз|Il premio è una mediaglia.|The prize is a medal.|Приз — медаль.
ecco|ˈekko|вот; вот поэтому|Ecco il tuo libro.|Here is your book.|Вот твоя книга.
insomma|inˈsomma|в общем; ну же|Insomma, decidi subito!|Come on, decide at once!|Ну же, решай немедленно!
magari|maˈɡari|может быть; если бы только|Magari domani piove.|Maybe it will rain tomorrow.|Может быть, завтра пойдёт дождь.
addirittura|addiritˈtura|даже (усиление)|Ha comprato addirittura una moto.|He even bought a motorbike.|Он даже купил мотоцикл.
veramente|veraˈmente| действительно|È veramente un bel film.|It is really a good film.|Это действительно хороший фильм.
presto|ˈprɛsto| рано|Torno presto stasera.|I will come home early tonight.|Я приду домой рано сегодня.
tardi|ˈtardi|поздно, с опозданием|Sono arrivato tardi a scuola.|I arrived late at school.|Я пришёл в школу поздно.
ormai|ormaˈi|уже (о времени)|Ormai è troppo tardi.|By now it is too late.|Уже слишком поздно.
finalmente|finalˈmente|наконец|Finalmente è venerdì!|Finally it is Friday!|Наконец-то пятница!
lentamente|lentaˈmente|медленно|Parla lentamente, per favore.|Speak slowly, please.|Говори медленно, пожалуйста.
rapidamente|rapidaˈmente| быстро|Chiudo rapidamente la finestra.|I close the window quickly.|Я быстро закрываю окно.
paziente|paˈtsjɛnte|терпеливый|Il maestro è molto paziente.|The teacher is very patient.|Учитель очень терпеливый.
curioso|kuˈrijoːzo|любопытный, любознательный|Il bambino è molto curioso.|The child is very curious.|Ребёнок очень любознательный.
pigro|ˈpiːɡro|ленивый|Il gatto è pigro la mattina.|The cat is lazy in the morning.|Кот утром ленивый.
generoso|dʒeneˈroːzo|щедрый|È un uomo generoso.|He is a generous man.|Он щедрый человек.
misterioso|misteˈrjoːzo|загадочный|La casa è misteriosa di notte.|The house is mysterious at night.|Дом ночью загадочный.
silenzioso|silenˈtsjoːzo|тихий, беззвучный|La biblioteca è silenziosa.|The library is silent.|Библиотека тихая.
rumoroso|rumoˈroːzo|шумный|Il quartiere è rumoroso di sera.|The neighbourhood is noisy in the evening.|Район шумный вечером.
pericoloso|perikoˈloːzo|опасный|La strada è pericolosa di notte.|The road is dangerous at night.|Дорога опасна ночью.
sicuro|siˈkuːro|безопасный; уверенный|Sono sicuro di lui.|I am sure about him.|Я уверен в нём.
perfetto|perˈfɛtto|идеальный, совершенный|La risposta è perfetta.|The answer is perfect.|Ответ идеальный.
completo|komˈpleːto| полный|Il quaderno è completo.|The notebook is complete.|Тетрадь полная.
unico|ˈuːniko|единственный|È l'unico libro che ho.|It is the only book I have.|Это единственная книга, которая у меня есть.
comune|koˈmuːne|общий; обычный|È un problema comune.|It is a common problem.|Это обычная проблема.
privato|priˈvato|частный, личный|Questo giardino è privato.|This garden is private.|Этот сад частный.
preciso|preˈtʃiːzo|точный, точный по времени|L'orario è preciso.|The timetable is exact.|Расписание точное.
sano|ˈsaːno|здоровый; полезный|Il cibo sano aiuta il corpo.|Healthy food helps the body.|Здоровая еда помогает телу.
crudo|ˈkruːdo|сырой|Il pesce crudo è fresco.|The raw fish is fresh.|Сырая рыба свежая.
cotto|ˈkotto|варёный, приготовленный|Il riso è cotto alla perfezione.|The rice is cooked to perfection.|Рис приготовлен идеально.
comodo|ˈkɔːmodo|удобный|La sedia è comoda.|The chair is comfortable.|Стул удобный.
scomodo|ˈskɔːmodo|неудобный|Il letto è scomodo.|The bed is uncomfortable.|Кровать неудобная.
affascinante|affaʃʃiˈnante| очаровательный|La città è affascinante di sera.|The city is charming at night.|Город очарователен вечером.
meraviglioso|meraviˈʎʎoːzo|чудесный|Il tramonto è meraviglioso.|The sunset is wonderful.|Закат чудесный.
stupendo|stuˈpɛndo|великолепный|Il concerto è stupendo.|The concert is stunning.|Концерт великолепен.
terribile|terˈriːbile|ужасный|Il traffico è terribile oggi.|The traffic is terrible today.|Пробки сегодня ужасные.
orribile|orˈriːbile|ужасный, отвратительный|Il tempo è orribile.|The weather is horrible.|Погода ужасная.
liscio|ˈliʃʃo|гладкий, ровный|Il pavimento è liscio.|The floor is smooth.|Пол гладкий.
doccia|ˈdottʃa|душ|La doccia è calda.|The shower is warm.|Душ тёплый.
vasca|ˈvaska|ванна|La vasca è piena d'acqua.|The bath is full of water.|Ванна полна воды.
lavatrice|lavaˈtritʃe|стиральная машина|La lavatrice è in bagno.|The washing machine is in the bathroom.|Стиральная машина в ванной.
pettine|ˈpettine|расчёска|Il pettine è sulla mensola.|The comb is on the shelf.|Расчёска на полке.
profumo|proˈfuːmo|духи; аромат|Questo profumo è dolce.|This perfume is sweet.|Эти духи сладкие.
aula|ˈaːula|аудитория, класс|L'aula è grande e luminosa.|The classroom is big and bright.|Аудитория большая и светлая.
ginnastica|dʒinˈnastika|физкультура; гимнастика|La ginnastica è il martedì.|PE is on Tuesday.|Физкультура по вторникам.
geografia|dʒeograˈfia|география|Studio geografia stasera.|I study geography tonight.|Я учу географию сегодня вечером.
matematica|matɛˈmatika|математика|La matematica è difficile.|Mathematics is difficult.|Математика трудная.
italiano|itaˈljaːno|итальянский (язык); итальянец|Studio italiano ogni giorno.|I study Italian every day.|Я учу итальянский каждый день.
inglese|iŋˈɡleːze|английский (язык); англичанин|L'inglese è utile per il lavoro.|English is useful for work.|Английский полезен для работы.
attimo|ˈattimo|мгновение|Un attimo, sto finendo.|One moment, I am finishing.|Мгновенье, я заканчиваю.
momento|moˈmento|момент|Il momento giusto è adesso.|The right moment is now.|Подходящий момент — сейчас.
valore|vaˈlore|ценность; значение|Questo libro ha un grande valore.|This book has great value.|Эта книга имеет большую ценность.
ragione|raˈdʒoːne|правота, разум|Hai ragione tu.|You are right.|Прав ты.
sistema|sisˈteːma|система; способ|Il sistema funziona bene.|The system works well.|Система работает хорошо.
metodo|ˈmeːtodo|метод|Il mio metodo è semplice.|My method is simple.|Мой метод простой.
esempio|eˈzɛmpjo|пример|Faccio un esempio.|I give an example.|Я привожу пример.
soluzione|soluˈtsjoːne|решение|La soluzione è facile.|The solution is easy.|Решение простое.
scelta|ˈʃɛlta|выбор|La scelta è tua.|The choice is yours.|Выбор за тобой.
occasione|okkaˈzjoːne|случай; возможность|È una buona occasione.|It is a good opportunity.|Это хорошая возможность.
abitudine|abitˈtuːdine|привычка|È una buona abitudine.|It is a good habit.|Это полезная привычка.
sorridere|sorˈriːdere|улыбаться|Sorrido alla fotografia.|I smile at the photograph.|Я улыбаюсь на фотографии.
respirare|respiˈraːre|дышать|Respiro l'aria fresca.|I breathe the fresh air.|Я дышу свежим воздухом.
osservare|osserˈvaːre|наблюдать|Osservo il mare dalla finestra.|I watch the sea from the window.|Я наблюдаю за морем из окна.
gustare|ɡuˈstaːre|наслаждаться вкусом|Gusto il gelato lentamente.|I taste the ice cream slowly.|Я медленно смакую мороженое.
assaggiare|assadˈdʒaːre|пробовать на вкус|Assaggio la zuppa prima di salare.|I taste the soup before adding salt.|Я пробую суп до соли.
versare|verˈsaːre|наливать|Verso l'acqua nel bicchiere.|I pour the water into the glass.|Я наливаю воду в стакан.
mescolare|meskoˈlaːre| мешать|Mescolo la pasta nel piatto.|I mix the pasta on the plate.|Я перемешиваю пасту на тарелке.
bollire|bolˈliːre|кипятить, кипеть|L'acqua bolle in cinque minuti.|The water boils in five minutes.|Вода кипит через пять минут.
cuocere|ˈkwɔːtʃere|готовить (варить, печь)|Cuoco il riso per venti minuti.|I cook the rice for twenty minutes.|Я варю рис двадцать минут.
vestirsi|vesˈtirsi|одеваться|Mi vesto in fretta.|I get dressed quickly.|Я одеваюсь быстро.
pettinarsi|pettiˈnarsi|причёсываться|Mi pettino davanti allo specchio.|I comb my hair in front of the mirror.|Я причёсываюсь перед зеркалом.
accendere|atˈtʃɛndere| включать|Accendo la luce del salotto.|I turn on the living room light.|Я включаю свет в гостиной.
spegnere|ˈspeɲɲere| выключать|Spegni la radio, per favore.|Turn off the radio, please.|Выключи радио, пожалуйста.
funzionare|funtsjoˈnaːre|работать, функционировать|Il computer funziona bene.|The computer works well.|Компьютер работает хорошо.
noleggiare|noledˈdʒaːre|брать напрокат|Noleggio una bicicletta per un giorno.|I hire a bicycle for a day.|Я беру велосипед на день.
affittare|affitˈtaːre|сдавать в аренду|Affitto una stanza in centro.|I rent out a room in the centre.|Я сдаю комнату в центре.
frenare|freˈnaːre|тормозить|Freno prima dell'angolo.|I brake before the corner.|Я торможу перед поворотом.
parcheggiare|parkeˈdʒjaːre|парковаться|Parcheggio vicino al mercato.|I park near the market.|Я паркуюсь рядом с рынком.
atterrare|atterˈraːre|приземляться|L'aereo atterra alle nove.|The plane lands at nine.|Самолёт приземляется в девять.
decollare|dekolˈlaːre|взлетать|L'aereo decolla alle sette.|The plane takes off at seven.|Самолёт взлетает в семь.
navigare|naviˈɡaːre|плыть; пользоваться интернетом|Navigo sul web ogni sera.|I surf the web every evening.|Я сижу в интернете каждый вечер.
immersione|immerˈsjoːne|погружение (под воду)|L'immersione è bella al mattino.|The dive is nice in the morning.|Погружение прекрасно утром.
crociera|kroˈtʃjeːra|круиз|La crociera parte da Genova.|The cruise leaves from Genoa.|Круиз отплывает из Генуи.
escursione|eskurˈsjoːne|экскурсия, поход|L'escursione dura tre ore.|The excursion lasts three hours.|Экскурсия длится три часа.
guida|ˈɡwiːda|путеводитель; гид|La guida parla di questo museo.|The guidebook talks about this museum.|Путеводитель рассказывает об этом музее.
mappa|ˈmappa|карта (схема)|La mappa è nel telefono.|The map is in the phone.|Карта в телефоне.
turista|tuˈrista|турист|Il turista fotografa la torre.|The tourist photographs the tower.|Турист фотографирует башню.
avventura|avvenˈtura|приключение|Questo viaggio è un'avventura.|This journey is an adventure.|Это путешествие — приключение.
ricordo|riˈkordo|воспоминание; сувенир|Il ricordo del viaggio è bello.|The memory of the journey is nice.|Воспоминание о поездке приятно.
scontrino|skonˈtriːno|чек (кассовый)|Conservo lo scontrino.|I keep the receipt.|Я сохраняю чек.
spesa|ˈspeːza|покупка; расходы; покупки продуктов|Faccio la spesa al mercato.|I do the shopping at the market.|Я делаю покупки на рынке.
acquisto|aˈkwiːsto|покупка|L'acquisto è buono.|The purchase is good.|Покупка удачная.
vendita|venˈdiːta| продажа|La vendita inizia domani.|The sale starts tomorrow.|Распродажа начинается завтра.
gratuito|ɡratiˈtuːto|бесплатный|Il museo è gratuito la domenica.|The museum is free on Sundays.|Музей бесплатный по воскресеньям.
commerciante|kommerˈtʃante|торговец|Il commerciante apre alle otto.|The shopkeeper opens at eight.|Торговец открывает в восемь.
cliente|kliˈɛnte|клиент, покупатель|Il cliente chiede il conto.|The customer asks for the bill.|Клиент просит счёт.
azienda|atˈsjɛnda|фирма, компания|L'azienda ha cento dipendenti.|The company has a hundred employees.|У компании сто сотрудников.
annuncio|anˈnuntʃo|объявление|Leggo un annuncio nel giornale.|I read an advert in the newspaper.|Я читаю объявление в газете.
colloquio|kolˈlɔːkwo| собеседование|Il colloquio è domani mattina.|The interview is tomorrow morning.|Собеседование завтра утром.
diploma|diˈploːma|диплом (школьный)|Il diploma è sul muro.|The diploma is on the wall.|Диплом на стене.
laurea|lauˈreːa|диплом университета; степень|Prendo la laurea a giugno.|I take my degree in June.|Я получаю диплом в июне.
corso|ˈkorso|курс (обучение)|Il corso dura tre mesi.|The course lasts three months.|Курс длится три месяца.
conferenza|konfeˈrɛntsa|конференция, лекция|La conferenza è in aula magna.|The lecture is in the main hall.|Лекция в большом зале.
volante|voˈlante|руль; летучий|Il volante è a destra.|The steering wheel is on the right.|Руль справа.
ruota|ˈrwoːta|колесо|La ruota è buca.|The wheel is flat.|Колесо спущено.
casco|ˈkasko|шлем|Il casco è necessario in moto.|The helmet is necessary on a motorbike.|Шлем необходим на мотоцикле.
bistecca|biˈstekka| стейк|La bistecca è alla griglia.|The steak is grilled.|Стейк на гриле.
salame|saˈlaːme|салями|Un panino con il salame.|A sandwich with salami.|Бутерброд с салями.
tonno|ˈtɔnno|тунец|L'insalata con il tonno è buona.|The salad with tuna is good.|Салат с тунцом вкусный.
brodo|ˈbroːdo|бульон|Il brodo caldo fa bene.|Hot broth is good for you.|Горячий бульон полезен.
mozzarella|mottsaˈrella|моцарелла|La mozzarella è fresca.|The mozzarella is fresh.|Моцарелла свежая.
cappuccino|kapputˈtʃiːno|капучино|Un cappuccino e un cornetto.|A cappuccino and a croissant.|Капучино и круассан.
tovagliolo|tovaˈʎʎolo|салфетка|Il tovagliolo è bianco.|The napkin is white.|Салфетка белая.
  `;

WM.DATA_IT = [
  {
    id: "top-verbs",
    name: "100 самых частотных глаголов",
    icon: "🏃",
    tag: "глаголы",
    desc: "Опорные глаголы — без них не строится ни одна фраза.",
    size: 100,
    words: `
essere|ˈɛssere|быть|Sono studente.|I am a student.|Я студент.
avere|aˈveːre|иметь|Ho una sorella.|I have a sister.|У меня есть сестра.
fare|ˈfaːre|делать|Che fai domani?|What are you doing tomorrow?|Что ты будешь делать завтра?
potere|poˈteːre|мочь|Posso aprire la finestra?|Can I open the window?|Можно открыть окно?
volere|ˈvoːlere|хотеть|Voglio un gelato.|I want an ice cream.|Я хочу мороженое.
dovere|ˈdoːvere| должен|Devo studiare stasera.|I have to study tonight.|Мне надо позаниматься сегодня вечером.
andare|anˈdaːre|идти, ехать|Vado a scuola in bicicletta.|I go to school by bike.|Я еду в школу на велосипеде.
venire|veˈniːre|приходить|Vieni alla festa?|Are you coming to the party?|Ты придёшь на праздник?
dare|ˈdaːre|давать|Dai il libro a Marco.|Give the book to Marco.|Дай книгу Марко.
dire|ˈdiːre|сказать|Perché non mi dici la verità?|Why don't you tell me the truth?|Почему ты не говоришь мне правду?
vedere|veˈdeːre|видеть|Vedo il mare dalla finestra.|I see the sea from the window.|Я вижу море из окна.
sapere|saˈpeːre|знать|Non lo so.|I don't know.|Я не знаю.
parlare|parˈlaːre|разговаривать|Parlo italiano e un po' d'inglese.|I speak Italian and a little English.|Я говорю по-итальянски и немного по-английски.
trovare|troˈvaːre|находить|Non trovo le chiavi.|I can't find the keys.|Не могу найти ключи.
stare|ˈstaːre| оставаться|Sto bene, grazie.|I am fine, thanks.|У меня всё хорошо, спасибо.
prendere|ˈprɛndere|брать|Prendo un caffè.|I'll have a coffee.|Я возьму кофе.
mettere|ˈmettere| класть|Metto il libro sul tavolo.|I put the book on the table.|Я кладу книгу на стол.
uscire|uʃˈʃiːre| выходить, уходить|Esco di casa alle otto.|I leave the house at eight.|Я выхожу из дома в восемь.
  passare|pasˈsaːre| тратить, проводить (время)|Passo il weekend con la famiglia.|I spend the weekend with my family.|Я провожу выходные с семьёй.
guardare|ɡwarˈdaːre|смотреть|Guardo la TV la sera.|I watch TV in the evening.|Я смотрю телевизор вечером.
cercare|tʃerˈkaːre|искать|Cerco un lavoro nuovo.|I am looking for a new job.|Я ищу новую работу.
ricordare|rikorˈdaːre|помнить|Non ricordo il suo nome.|I don't remember his name.|Я не помню его имя.
credere|ˈkreːdere| верить|Non credo a questa storia.|I don't believe this story.|Я не верю в эту историю.
sentire|senˈtiːre| слышать|Sento un rumore strano.|I hear a strange noise.|Я слышу странный шум.
chiedere|ˈkjɛːdere|спрашивать|Chiedo informazioni in stazione.|I ask for information at the station.|Я спрашиваю информацию на вокзале.
rispondere|risˈpɔndere|отвечать|Rispondo sempre alle email.|I always answer emails.|Я всегда отвечаю на письма.
leggere|ˈleddʒere|читать|Leggo un libro ogni mese.|I read a book every month.|Я читаю книгу каждый месяц.
scrivere|ˈskriːvere|писать|Scrivo una lettera alla nonna.|I write a letter to grandma.|Я пишу письмо бабушке.
mangiare|manˈdʒaːre|есть|Mangio la pasta ogni giorno.|I eat pasta every day.|Я ем пасту каждый день.
bere|ˈbeːre|пить|Bevi acqua o vino?|Do you drink water or wine?|Ты пьёшь воду или вино?
dormire|dorˈmiːre|спать|Dormo otto ore ogni notte.|I sleep eight hours every night.|Я сплю восемь часов каждую ночь.
lavorare|lavoˈraːre|работать|Lavoro in un ufficio.|I work in an office.|Я работаю в офисе.
vivere|ˈviːvere|жить|Vivo a Roma da dieci anni.|I have lived in Rome for ten years.|Я живу в Риме десять лет.
conoscere|koˈnoʃʃere| быть знакомым|Conosco bene questa città.|I know this city well.|Я хорошо знаю этот город.
pensare|penˈsaːre|думать|Penso spesso a te.|I often think about you.|Я часто думаю о тебе.
amare|aˈmaːre|любить|Amo la musica italiana.|I love Italian music.|Я люблю итальянскую музыку.
capire|kaˈpiːre|понимать|Non capisco questa parola.|I don't understand this word.|Я не понимаю это слово.
finire|fiˈniːre|заканчивать|Finisco di lavorare alle sei.|I finish work at six.|Я заканчиваю работать в шесть.
partire|parˈtiːre|уезжать, отправляться|Il treno parte alle nove.|The train leaves at nine.|Поезд отправляется в девять.
arrivare|arriˈvaːre|прибывать|Arriviamo domani mattina.|We arrive tomorrow morning.|Мы приедем завтра утром.
diventare|divenˈtaːre|становиться|Mia sorella diventa medico.|My sister is becoming a doctor.|Моя сестра становится врачом.
iniziare|innitˈtsjaːre|начинать|Il film inizia alle otto.|The film starts at eight.|Фильм начинается в восемь.
continuare|kontinuˈaːre|продолжать|Continui sempre a parlare!|You keep talking all the time!|Ты всё время продолжаешь говорить!
aspettare|aspetˈtaːre|ждать|Aspettami qui!|Wait for me here!|Подожди меня здесь!
entrare|enˈtraːre|входить|Possiamo entrare?|Can we come in?|Мы можем войти?
tornare|torˈnaːre|возвращаться|Torno a casa alle sette.|I come back home at seven.|Я возвращаюсь домой в семь.
salire|saˈliːre|подниматься|Saliamo in macchina.|Let's get in the car.|Давай сядем в машину.
scendere|ˈʃɛndere|спускаться|Scendo alla prossima fermata.|I get off at the next stop.|Я выхожу на следующей остановке.
correre|ˈkɔrrere| бегать|Corro ogni mattina nel parco.|I run in the park every morning.|Я бегаю в парке каждое утро.
camminare|kammiˈnaːre| ходить пешком|Cammino mezz'ora ogni giorno.|I walk half an hour every day.|Я хожу пешком полчаса каждый день.
volare|voˈlaːre|летать|Gli uccelli volano in cielo.|Birds fly in the sky.|Птицы летают в небе.
nuotare|nwoˈtaːre|плавать|In estate nuoto nel mare.|In summer I swim in the sea.|Летом я плаваю в море.
guidare|ɡwiˈdaːre|водить (машину)|Guido la macchina di mio padre.|I drive my father's car.|Я веду машину моего отца.
comprare|komˈpraːre|покупать|Compro il pane ogni mattina.|I buy bread every morning.|Я покупаю хлеб каждое утро.
vendere|ˈvɛndere|продавать|Vendiamo frutta al mercato.|We sell fruit at the market.|Мы продаём фрукты на рынке.
pagare|paˈɡaːre|платить|Chi paga il conto?|Who is paying the bill?|Кто платит по счёту?
costare|kosˈtaːre|стоить|Quanto costa questo libro?|How much does this book cost?|Сколько стоит эта книга?
aprire|aˈpriːre|открывать|Apro la finestra, è caldo.|I open the window, it is hot.|Я открываю окно, жарко.
chiudere|ˈkjuːdere|закрывать|Chiudi la porta, per favore.|Close the door, please.|Закрой дверь, пожалуйста.
portare|porˈtaːre| приносить|Porto un regalo ad Anna.|I am bringing a present for Anna.|Я несу подарок Анне.
tenere|ˈteːnere|держать|Tieni il mio telefono un momento.|Hold my phone for a moment.|Подержи мой телефон минуту.
lasciare|laʃˈʃaːre| позволять|Lascio il libro a casa.|I leave the book at home.|Я оставляю книгу дома.
aiutare|aijuˈtaːre|помогать|Aiuto mia madre in cucina.|I help my mother in the kitchen.|Я помогаю маме на кухне.
servire|serˈviːre| служить|Mi serve un aiuto.|I need some help.|Мне нужна помощь.
imparare|imparaˈreːre| выучить|Imparo parole nuove ogni giorno.|I learn new words every day.|Я учу новые слова каждый день.
insegnare|inseɲˈɲaːre| преподавать|Insegno inglese in una scuola.|I teach English at a school.|Я преподаю английский в школе.
studiare|stuˈdjaːre| учиться|Studio italiano la sera.|I study Italian in the evening.|Я учу итальянский вечером.
ripetere|riˈpeːtere|повторять|Ripeti, per favore, non ho capito.|Repeat, please, I didn't understand.|Повтори, пожалуйста, я не понял.
dimenticare|dimenˈtikaːre|забывать|Dimentico sempre le chiavi.|I always forget the keys.|Я всегда забываю ключи.
svegliarsi|zveʎˈʎarsi|просыпаться|Mi sveglio alle sette.|I wake up at seven.|Я просыпаюсь в семь.
alzarsi|alˈtsarsi|вставать|Ti alzi presto la domenica?|Do you get up early on Sunday?|Ты встаёшь рано в воскресенье?
sedersi|seˈdersi| садиться|Sedetevi, per favore.|Sit down, please.|Садитесь, пожалуйста.
chiamarsi|kjaˈmarsi| называть(ся)|Come ti chiami?|What is your name?|Как тебя зовут?
divertirsi|diverˈtirsi|веселиться|Ci divertiamo alla festa.|We are having fun at the party.|Мы веселимся на празднике.
sentirsi|senˈtirsi| чувствовать себя|Come ti senti oggi?|How do you feel today?|Как ты себя чувствуешь сегодня?
mostrare|moˈstraːre|показывать|Ti mostro la mia città.|I will show you my city.|Я покажу тебе мой город.
mandare|manˈdaːre|отправлять|Mando un messaggio a Luca.|I am sending a message to Luca.|Я отправляю сообщение Лука.
ricevere|riˈtʃeːvere|получать|Ricevo tante email al lavoro.|I receive many emails at work.|Я получаю много писем на работе.
offrire|ofˈfriːre|предлагать|Ti offro un caffè.|I offer you a coffee.|Я угощаю тебя кофе.
accettare|attʃetˈtaːre|принимать|Accetto la tua proposta.|I accept your proposal.|Я принимаю твоё предложение.
rifiutare|rifjuˈtaːre|отказывать|Rifiuto l'invito, sono stanco.|I decline the invitation, I am tired.|Я отклоняю приглашение, я устал.
perdere|ˈpɛrdere|терять, проигрывать|Perdo sempre le chiavi!|I always lose the keys!|Я вечно теряю ключи!
vincere|ˈvintʃere|побеждать|La nostra squadra vince spesso.|Our team often wins.|Наша команда часто побеждает.
riuscire|riuʃˈʃiːre|удаваться, справляться|Non riesco a dormire.|I can't sleep.|Я не могу заснуть.
sembrare|semˈbraːre|казаться|Sembra una persona gentile.|He seems like a kind person.|Он кажется добрым человеком.
nascere|ˈnaʃʃere|рождаться|Mia figlia è nata in maggio.|My daughter was born in May.|Моя дочь родилась в мае.
morire|moˈriːre|умирать|Le piante muoiono senza acqua.|Plants die without water.|Растения умирают без воды.
tagliare|taʎˈʎaːre|резать|Taglio il pane.|I am cutting the bread.|Я режу хлеб.
cucinare|kutʃiˈnaːre|готовить (еду)|Mio padre cucina molto bene.|My father cooks very well.|Мой папа готовит очень хорошо.
suonare|swoˈnaːre| играть|Suono la chitarra.|I play the guitar.|Я играю на гитаре.
cantare|kanˈtaːre|петь|Canto sempre sotto la doccia.|I always sing in the shower.|Я всегда пою в душе.
ballare|balˈlaːre|танцевать|Balliamo bene insieme.|We dance well together.|Мы хорошо танцуем вместе.
disegnare|dizeɲˈɲaːre|рисовать|I bambini disegnano una casa.|The children are drawing a house.|Дети рисуют дом.
costruire|kostruˈiːre|строить|Costruiscono una casa nuova.|They are building a new house.|Они строят новый дом.
preferire|preferiˈre|предпочитать|Preferisco il tè al caffè.|I prefer tea to coffee.|Я предпочитаю чай кофе.
raccontare|rakkonˈtaːre|рассказывать|La nonna racconta una storia.|Grandma is telling a story.|Бабушка рассказывает историю.
ascoltare|askolˈtaːre|слушать|Ascolto musica in autobus.|I listen to music on the bus.|Я слушаю музыку в автобусе.
piacere|pjaˈtʃeːre| нравиться|Mi piace la pizza.|I like pizza.|Мне нравится пицца.
  produrre|proˈdurre| делать, создавать| Questa fabbrica produce automobili.| This factory makes cars.| Этот завод производит машины.
  usare|uˈzaːre| использовать| Posso usare il tuo telefono?| Can I use your phone?| Можно воспользоваться твоим телефоном?
  `,
  },
  {
    id: "top-words",
    name: "100 самых частотных слов",
    icon: "⭐",
    tag: "частотные",
    desc: "Слова, которые встречаются в речи чаще всего.",
    size: 100,
    words: `
e|e|и|Marco e Luca sono amici.|Marco and Luca are friends.|Марко и Лука — друзья.
o|ɔ|или|Vuoi tè o caffè?|Do you want tea or coffee?|Хочешь чай или кофе?
ma|ma|но|Voglio venire, ma sono stanco.|I want to come, but I am tired.|Я хочу прийти, но я устал.
se|se| если|Se piove, resto a casa.|If it rains, I stay home.|Если идёт дождь, я остаюсь дома.
che|ke| что|Questo è il libro che cerco.|This is the book that I am looking for.|Это книга, которую я ищу.
come|ˈkome|как|Come stai?|How are you?|Как ты?
quando|ˈkwando|когда|Quando inizia il film?|When does the film start?|Когда начинается фильм?
dove|ˈdɔːve|где, куда|Dove abiti?|Where do you live?|Где ты живёшь?
perché|perˈke| почему|Perché studi l'italiano?|Why do you study Italian?|Почему ты учишь итальянский?
non|nɔn|не|Non lo capisco.|I don't understand it.|Я не понимаю этого.
sì|si|да|Sì, hai ragione.|Yes, you are right.|Да, ты прав.
no|nɔ|нет|No, grazie.|No, thanks.|Нет, спасибо.
grazie|ˈɡrattsje|спасибо|Grazie per il tuo aiuto!|Thank you for your help!|Спасибо за твою помощь!
prego|ˈprɛːɡo|пожалуйста (в ответ на спасибо)|Grazie mille! — Prego!|Thank you very much! — You are welcome!|Большое спасибо! — Пожалуйста!
ciao|tʃao|привет, пока|Ciao, come va?|Hi, how are you?|Привет, как дела?
buongiorno|bwonˈdʒorno|добрый день|Buongiorno, dottore!|Good morning, doctor!|Добрый день, доктор!
buonasera|ˌbwɔnaˈseːra|добрый вечер|Buonasera, signora!|Good evening, madam!|Добрый вечер, синьора!
buonanotte|ˌbwɔnaˈnɔtte|спокойной ночи|Buonanotte, sogni d'oro!|Good night, sweet dreams!|Спокойной ночи, приятных снов!
arrivederci|arriveˈdertʃi|до свидания|Arrivederci e grazie!|Goodbye and thank you!|До свидания и спасибо!
scusi|ˈskuːzi| извините|Scusi, dov'è la stazione?|Excuse me, where is the station?|Извините, где вокзал?
mi dispiace|mi dispˈjaːtʃe|мне жаль|Mi dispiace, non posso venire.|I am sorry, I can't come.|Мне жаль, я не могу прийти.
io|ˈiːo|я|Io lavoro, tu studi.|I work, you study.|Я работаю, ты учишься.
tu|tu| ты|E tu, come stai?|And you, how are you?|А ты как?
lui|lui|он|Lui è mio fratello.|He is my brother.|Он мой брат.
  lei|lɛi| она|Lei è mia sorella.|She is my sister.|Она моя сестра.
noi|nɔi|мы|Noi abitiamo a Milano.|We live in Milan.|Мы живём в Милане.
voi|vɔi|вы|Voi dove andate?|Where are you going?|Куда вы идёте?
loro|ˈlɔːro|они|Loro non parlano italiano.|They don't speak Italian.|Они не говорят по-итальянски.
  questo|ˈkwesto| это, этот|Questo libro è interessante.|This book is interesting.|Эта книга интересная.
quello|ˈkwɛllo| тот|Quella casa è vecchia.|That house is old.|Тот дом старый.
qui|kwi|здесь|Vieni qui, per favore.|Come here, please.|Иди сюда, пожалуйста.
lì|li|там|I libri sono lì, sul tavolo.|The books are there, on the table.|Книги там, на столе.
ora|ˈɔːra| сейчас|Che ora è?|What time is it?|Который час?
oggi|ˈɔddʒi|сегодня|Oggi resto a casa.|Today I am staying home.|Сегодня я остаюсь дома.
ieri|ˈjɛːri|вчера|Ieri ho visto Marco.|I saw Marco yesterday.|Вчера я видел Марко.
domani|doˈmaːni|завтра|Domani vado al mare.|Tomorrow I am going to the sea.|Завтра я еду на море.
sempre|ˈsɛmpre|всегда|Marco è sempre in ritardo.|Marco is always late.|Марко всегда опаздывает.
mai|mai|никогда|Non mangio mai la carne.|I never eat meat.|Я никогда не ем мясо.
spesso|ˈspɛsso|часто|Spesso vado a piedi al lavoro.|I often walk to work.|Я часто хожу на работу пешком.
  molto|ˈmolto| очень|Sei molto gentile!|You are very kind!|Ты очень добрый!
poco|ˈpɔːko| мало|Ho poco tempo oggi.|I have little time today.|У меня мало времени сегодня.
tutto|ˈtutto| всё, весь|Tutto va bene.|Everything is fine.|Всё хорошо.
niente|ˈnjɛnte| ничего|Non capisco niente!|I don't understand anything!|Я ничего не понимаю!
qualcosa|kwalˈkoːza|что-то|Voglio dirti qualcosa.|I want to tell you something.|Я хочу тебе кое-что сказать.
qualcuno|kwalˈkuːno|кто-то|C'è qualcuno alla porta.|There is someone at the door.|У двери кто-то есть.
  uno|ˈuːno| один|Ho uno zaino nuovo.|I have a new backpack.|У меня новый рюкзак.
due|ˈduːe|два|Ho due gatti.|I have two cats.|У меня два кота.
tre|tre|три|Il treno parte alle tre.|The train leaves at three.|Поезд отправляется в три.
casa|ˈkaːza|дом|Torno a casa presto.|I am coming home early.|Я приду домой рано.
acqua|ˈakkwa|вода|Bevo molta acqua.|I drink a lot of water.|Я пью много воды.
giorno|ˈdʒorno|день|Che giorno è oggi?|What day is it today?|Какой сегодня день?
notte|ˈnɔtte|ночь|La notte dormo bene.|At night I sleep well.|Ночью я сплю хорошо.
sera|ˈseːra|вечер|La sera guardo la TV.|In the evening I watch TV.|Вечером я смотрю телевизор.
mattina|matˈtiːna|утро|La mattina bevo un caffè.|In the morning I drink a coffee.|Утром я пью кофе.
anno|ˈanno|год|Buon anno nuovo!|Happy New Year!|С Новым годом!
mese|ˈmeːze|месяц|Questo mese lavoro molto.|This month I am working a lot.|В этом месяце я много работаю.
settimana|settiˈmaːna|неделя|Ti vedo la prossima settimana.|I'll see you next week.|Увидимся на следующей неделе.
tempo|ˈtempo| время|Non ho tempo adesso.|I don't have time now.|У меня сейчас нет времени.
strada|ˈstraːda| дорога|Questa strada è molto trafficata.|This road is very busy.|Эта дорога очень оживлённая.
città|tʃitˈta|город|Roma è una città bellissima.|Rome is a very beautiful city.|Рим — очень красивый город.
uomo|ˈwɔːmo|мужчина, человек|Quell'uomo è mio padre.|That man is my father.|Тот мужчина — мой отец.
donna|ˈdɔnna|женщина|Quella donna è la mia professoressa.|That woman is my teacher.|Та женщина — моя преподавательница.
bambino|bamˈbiːno|ребёнок|Il bambino gioca nel parco.|The child is playing in the park.|Ребёнок играет в парке.
amico|aˈmiːko|друг|Marco è il mio migliore amico.|Marco is my best friend.|Марко — мой лучший друг.
madre|ˈmaːdre| мать|Mia madre cucina benissimo.|My mother cooks very well.|Моя мама готовит очень хорошо.
padre|ˈpaːdre| отец|Mio padre lavora in banca.|My father works in a bank.|Мой папа работает в банке.
mano|ˈmaːno|рука|Scrivo con la mano destra.|I write with my right hand.|Я пишу правой рукой.
occhio|ˈɔkkjo|глаз|Ho qualcosa nell'occhio.|I have something in my eye.|У меня что-то в глазу.
testa|ˈtɛsta|голова|Mi fa male la testa.|My head hurts.|У меня болит голова.
cibo|ˈtʃiːbo|еда|Il cibo italiano è delizioso.|Italian food is delicious.|Итальянская еда очень вкусная.
pane|ˈpaːne|хлеб|Compro il pane ogni mattina.|I buy bread every morning.|Я покупаю хлеб каждое утро.
vino|ˈviːno|вино|Questo vino è molto buono.|This wine is very good.|Это вино очень хорошее.
caffè|kafˈfɛ|кофе|Vuoi un caffè?|Do you want a coffee?|Хочешь кофе?
soldi|ˈsɔldi|деньги|Non ho soldi con me.|I don't have money with me.|У меня нет с собой денег.
lavoro|laˈvoːro|работа|Il mio lavoro è interessante.|My job is interesting.|Моя работа интересная.
scuola|ˈskwɔːla|школа|I miei figli vanno a scuola.|My children go to school.|Мои дети ходят в школу.
libro|ˈliːbro|книга|Questo libro è di Marco.|This book is Marco's.|Эта книга Марко.
parola|paˈrɔːla|слово|Non conosco questa parola.|I don't know this word.|Я не знаю это слово.
nome|ˈnoːme|имя|Scrivi il tuo nome qui, per favore.|Write your name here, please.|Напиши своё имя здесь, пожалуйста.
vita|ˈviːta|жизнь|La vita a Roma è bella.|Life in Rome is beautiful.|Жизнь в Риме прекрасна.
mondo|ˈmondo|мир|Il mondo è grande.|The world is big.|Мир большой.
parte|ˈparte|часть|Questa è la mia parte preferita del film.|This is my favorite part of the film.|Это моя любимая часть фильма.
modo|ˈmɔːdo| способ|Non c'è un altro modo.|There is no other way.|Другого способа нет.
cosa|ˈkɔːza| вещь|La cosa più importante è la salute.|The most important thing is health.|Самое важное — это здоровье.
posto|ˈpɔsto|место|Questo posto è libero?|Is this seat free?|Это место свободно?
signora|siɲˈɲoːra| госпожа|Buongiorno, signora Rossi!|Good morning, Mrs. Rossi!|Добрый день, синьора Росси!
signore|siˈɲoːre| господин|Buonasera, signore!|Good evening, sir!|Добрый вечер, синьор!
amore|aˈmoːre| любовь|L'amore è importante nella vita.|Love is important in life.|Любовь важна в жизни.
famiglia|faˈmiʎʎa|семья|La mia famiglia abita a Mosca.|My family lives in Moscow.|Моя семья живёт в Москве.
sì e no|si e ˈnɔ|да и нет|Sei stanco? — Sì e no.|Are you tired? — Yes and no.|Ты устал? — И да, и нет.
forse|ˈfɔrse|может быть|Forse domani piove.|Maybe it will rain tomorrow.|Может быть, завтра будет дождь.
bene|ˈbɛːne| хорошо|Parli molto bene l'italiano!|You speak Italian very well!|Ты очень хорошо говоришь по-итальянски!
male|ˈmaːle| плохо|Mi sento male.|I feel sick.|Я чувствую себя плохо.
molto bene|ˈmolto ˈbɛːne|очень хорошо|Il progetto va molto bene.|The project is going very well.|Проект идёт очень хорошо.
va bene|va ˈbɛːne|ладно, хорошо|Va bene, ci vediamo domani!|OK, see you tomorrow!|Ладно, увидимся завтра!
vero|ˈveːro|правда, верный|È vero, hai ragione.|It is true, you are right.|Это правда, ты прав.
persone|perˈsoːne|люди|In città ci sono tante persone.|There are many people in the city.|В городе много людей.
cose|ˈkoːze| вещи|Dimentico sempre le mie cose.|I always forget my things.|Я всегда забываю свои вещи.
  il|il| определённый артикль| Il libro è sul tavolo.| The book is on the table.| Книга на столе.
  un|un| неопределённый артикль| Ho un nuovo zaino.| I have a new backpack.| У меня новый рюкзак.
  `,
  },
  {
    id: "top-300",
    name: "300 самых частотных слов",
    icon: "📈",
    tag: "топ-300",
    desc: "Самое нужное ядро языка — база для понимания речи.",
    size: 300,
    words: CORE_TOP,
  },
  {
    id: "top-1000",
    name: "1000 самых частотных слов",
    icon: "🏔️",
    tag: "топ-1000",
    desc: "Частотный список на 1000 слов: ядро плюс частая лексика повседневной речи.",
    size: 1000,
    words: CORE_TOP + CORE_EXT,
  },
  {
    id: "food",
    name: "Еда",
    icon: "🍝",
    tag: "еда",
    desc: "Продукты, блюда и то, чем едят.",
    words: `
pasta|ˈpasta|паста, макароны|Mangio la pasta al pomodoro.|I eat pasta with tomato sauce.|Я ем пасту с помидорами.
pizza|ˈpittsa|пицца|Ordiniamo una pizza stasera.|Let's order a pizza tonight.|Закажем пиццу сегодня вечером.
pane|ˈpaːne|хлеб|Il pane è fresco.|The bread is fresh.|Хлеб свежий.
acqua|ˈakkwa|вода|Bevo due litri d'acqua al giorno.|I drink two liters of water a day.|Я пью два литра воды в день.
vino|ˈviːno|вино|Beviamo un bicchiere di vino.|We are drinking a glass of wine.|Мы пьём бокал вина.
birra|ˈbirra|пиво|Una birra fredda, per favore.|A cold beer, please.|Холодное пиво, пожалуйста.
caffè|kafˈfɛ|кофе|Il caffè è troppo forte.|The coffee is too strong.|Кофе слишком крепкий.
latte|ˈlatte|молоко|Il latte è nel frigorifero.|The milk is in the fridge.|Молоко в холодильнике.
formaggio|forˈmaddʒo|сыр|Il formaggio è sul piatto.|The cheese is on the plate.|Сыр на тарелке.
carne|ˈkarne|мясо|Questa carne è molto buona.|This meat is very good.|Это мясо очень вкусное.
pollo|ˈpɔllo|курица|Mangiamo il pollo la domenica.|We eat chicken on Sundays.|Мы едим курицу по воскресеньям.
pesce|ˈpeʃʃe|рыба|Vuoi pesce o carne?|Do you want fish or meat?|Хочешь рыбу или мясо?
prosciutto|proʃˈʃutto|ветчина|Il panino è con prosciutto e formaggio.|The sandwich is with ham and cheese.|Бутерброд с ветчиной и сыром.
riso|ˈriːzo|рис|Il riso non è pronto.|The rice is not ready yet.|Рис ещё не готов.
zuppa|ˈtsuppa|суп|La zuppa è calda.|The soup is hot.|Суп горячий.
insalata|insaˈlaːta|салат|Un'insalata mista, per favore.|A mixed salad, please.|Смешанный салат, пожалуйста.
pomodoro|pomoˈdoːro|помидор|Metto il pomodoro nell'insalata.|I put tomato in the salad.|Я кладу помидор в салат.
mozzarella|mottsaˈrɛlla|моцарелла|La pizza è con mozzarella.|The pizza is with mozzarella.|Пицца с моцареллой.
olio|ˈɔːljo|оливковое масло|Nell'insalata metto olio e sale.|I put oil and salt in the salad.|В салат я кладу масло и соль.
pepe|ˈpeːpe|перец|Il pepe è troppo piccante.|The pepper is too spicy.|Перец слишком острый.
uovo|ˈwɔːvo|яйцо|Le uova sono in frigorifero.|The eggs are in the fridge.|Яйца в холодильнике.
burro|ˈburro|масло (сливочное)|Mettiamo il burro sul pane.|We put butter on bread.|Мы кладём масло на хлеб.
frutta|ˈfrutta|фрукты|La frutta è sul tavolo.|The fruit is on the table.|Фрукты на столе.
arancia|aˈrantʃa|апельсин|Bevo un succo d'arancia.|I drink orange juice.|Я пью апельсиновый сок.
banana|baˈnaːna|банан|La scimmia mangia una banana.|The monkey eats a banana.|Обезьяна ест банан.
limone|liˈmoːne|лимон|Il tè con limone, per favore.|Tea with lemon, please.|Чай с лимоном, пожалуйста.
gelato|dʒeˈlaːto|мороженое|Due gelati, per favore!|Two ice creams, please!|Два мороженых, пожалуйста!
dolce|ˈdoltʃe| десерт|Non mangio dolci la sera.|I don't eat sweets in the evening.|Я не ем сладкое вечером.
torta|ˈtorta|торт|Questa torta è fatta in casa.|This cake is homemade.|Этот торт домашний.
ghiaccio|ˈɡjattʃo|лёд|Il ghiaccio è freddo.|The ice is cold.|Лёд холодный.
piatto|ˈpjatto| тарелка|Qual è il piatto del giorno?|What is the dish of the day?|Какое блюдо дня?
forchetta|forˈketta|вилка|La forchetta è a sinistra.|The fork is on the left.|Вилка слева.
cucchiaio|kukˈkjaːjo|ложка|Mi dai un cucchiaio?|Can you give me a spoon?|Дашь мне ложку?
coltello|kolˈtɛllo|нож|Taglio la carne col coltello.|I cut the meat with the knife.|Я режу мясо ножом.
bicchiere|bikˈkjɛːre|стакан|Vorrei un bicchiere di vino.|I'd like a glass of wine.|Я хотел бы бокал вина.
tazza|ˈtattsa|чашка|Questa tazza è mia.|This cup is mine.|Эта чашка моя.
bottiglia|botˈtiʎʎa|бутылка|Una bottiglia d'acqua, per favore.|A bottle of water, please.|Бутылку воды, пожалуйста.
colazione|kolatˈtsjoːne|завтрак|La colazione è alle sette.|Breakfast is at seven.|Завтрак в семь.
posate|poˈzaːte|столовые приборы|Le posate sono sul tavolo.|The cutlery is on the table.|Столовые приборы на столе.
tostapane|tostaˈpaːne|тостер|Il tostapane è in cucina.|The toaster is in the kitchen.|Тостер на кухне.
spremiagrumi|spremjaˈɡruːmi|соковыжималка|Faccio la spremuta con lo spremiagrumi.|I make juice with the juicer.|Я делаю сок соковыжималкой.
grembiule|ɡremˈbjuːle|фартук|Mi metto il grembiule per cucinare.|I put on an apron to cook.|Я надеваю фартук, чтобы готовить.
padella|paˈdɛlla|сковорода|La padella è sul fuoco.|The pan is on the stove.|Сковорода на плите.
chef|ʃɛf|шеф-повар|Il chef prepara un piatto nuovo.|The chef prepares a new dish.|Шеф-повар готовит новое блюдо.
antipasti|antiˈpaːsti|закуски|Gli antipasti sono pronti.|The appetizers are ready.|Закуски готовы.
scolapasta|skɔlaˈpasta|дуршлаг|Scolo la pasta con lo scolapasta.|I drain the pasta with the colander.|Я сливаю пасту через дуршлаг.
spumante|spuˈmante|игристое вино|A festa beviamo lo spumante.|We drink sparkling wine at parties.|На празднике мы пьём игристое вино.
bilancia|biˈlantʃa|весы|Peso la farina con la bilancia.|I weigh the flour with the scales.|Я взвешиваю муку на весах.
caffettiera|kaffetˈtjɛːra|кофеварка (гейзерная)|Preparo il caffè con la caffettiera.|I make coffee with the moka pot.|Я готовлю кофе в гейзерной кофеварке.
  zucchero|tsukˈkeːro| сахар| Non metto zucchero nel caffè.| I don't put sugar in my coffee.| Я не кладу сахар в кофе.
  sale|ˈsaːle| соль| Il sale è sul tavolo.| The salt is on the table.| Соль на столе.
  mela|ˈmeːla| яблоко| Mangio una mela ogni giorno.| I eat an apple every day.| Я ем яблоко каждый день.
  pranzo|ˈprantso| обед| Il pranzo è pronto.| Lunch is ready.| Обед готов.
  cena|ˈtʃeːna| ужин| La cena è alle otto.| Dinner is at eight.| Ужин в восемь.
  ristorante|ristoˈrante| ресторан| Questo ristorante è famoso.| This restaurant is famous.| Этот ресторан знаменит.
  menù|meˈnu| меню| Il menù è in italiano e in inglese.| The menu is in Italian and English.| Меню на итальянском и английском.
  conto|ˈkonto| счёт (в кафе)| Il conto, per favore.| The bill, please.| Счёт, пожалуйста.
  cameriere|kameˈrjeːre| официант| Il cameriere è gentile.| The waiter is polite.| Официант вежливый.
  `,
  },
  {
    id: "clothes",
    name: "Одежда",
    icon: "👕",
    tag: "одежда",
    desc: "Гардероб от носков до пальто.",
    words: `
camicia|kaˈmiːtʃa|рубашка|Indosso una camicia bianca.|I am wearing a white shirt.|Я ношу белую рубашку.
maglietta|maʎˈʎɛtta|футболка|Questa maglietta è troppo piccola per me.|This t-shirt is too small for me.|Эта футболка слишком маленькая для меня.
maglione|maˈʎʎoːne|свитер|In inverno indosso il maglione.|In winter I wear a sweater.|Зимой я ношу свитер.
felpa|ˈfelpa|толстовка|La felpa è comoda per lo sport.|The hoodie is comfortable for sport.|Толстовка удобна для спорта.
giacca|ˈdʒakka|пиджак, куртка|Mi metto la giacca, fa freddo.|I put on my jacket, it is cold.|Я надену куртку, холодно.
cappotto|kapˈpɔtto|пальто|Il cappotto grigio è mio.|The grey coat is mine.|Серое пальто — моё.
pantaloni|pantaˈloːni|брюки|Questi pantaloni sono nuovi.|These trousers are new.|Эти брюки новые.
jeans|dʒins|джинсы|I jeans blu sono di Luca.|The blue jeans are Luca's.|Синие джинсы — Лука.
gonna|ˈɡonna|юбка|Mia sorella porta una gonna rossa.|My sister is wearing a red skirt.|Моя сестра носит красную юбку.
abito|ˈaːbito| платье|L'abito nero è elegante.|The black dress is elegant.|Чёрное платье элегантное.
scarpe|ˈskarpe|обувь, туфли|Mi metto le scarpe e esco.|I put on my shoes and go out.|Я обуваюсь и выхожу.
stivali|stiˈvaːli| сапоги|Gli stivali sono per la pioggia.|The boots are for rain.|Сапоги — для дождя.
calze|ˈkaltse| носки|Ho calze nuove.|I have new socks.|У меня новые носки.
cintura|tʃinˈtuːra|ремень|Questa cintura è di pelle.|This belt is made of leather.|Этот ремень из кожи.
cappello|kapˈpɛllo|шляпа, шапка|In estate porto il cappello.|In summer I wear a hat.|Летом я ношу шляпу.
sciarpa|ˈʃarpa|шарф|Metto la sciarpa, fa freddo.|I put on a scarf, it is cold.|Я надену шарф, холодно.
guanti|ˈɡwanti|перчатки|I guanti tengono le mani calde.|The gloves keep my hands warm.|Перчатки согревают руки.
occhiali|okˈkjaːli|очки|Senza occhiali non vedo bene.|Without glasses I don't see well.|Без очков я плохо вижу.
borsa|ˈborsa|сумка|La borsa è pesante.|The bag is heavy.|Сумка тяжёлая.
zaino|ˈdzaino|рюкзак|Il mio zaino è pieno di libri.|My backpack is full of books.|Мой рюкзак полон книг.
pigiama|piˈdʒaːma|пижама|Il pigiama è sul letto.|The pajamas are on the bed.|Пижама на кровати.
costume da bagno|kosˈtuːme da ˈbaɲɲo|купальник, плавки|Ho comprato un costume da bagno nuovo.|I bought a new swimsuit.|Я купил новый купальник.
asciugamano|aʃʃuɡaˈmaːno|полотенце|L'asciugamano è nel bagno.|The towel is in the bathroom.|Полотенце в ванной.
bottone|botˈtoːne|пуговица|Un bottone è caduto dalla camicia.|A button fell off the shirt.|Пуговица оторвалась от рубашки.
tasca|ˈtaska|карман|Le chiavi sono nella tasca.|The keys are in the pocket.|Ключи в кармане.
taglia|ˈtaʎʎa|размер|Che taglia porta suo figlio?|What size does her son wear?|Какой размер носит её сын?
provare|proˈvaːre|примерять|Posso provare questa maglietta?|Can I try on this t-shirt?|Можно примерить эту футболку?
indossare|indosˈsaːre|носить (одежду)|Indossa sempre gli occhiali da sole.|He always wears sunglasses.|Он всегда носит солнцезащитные очки.
  `,
  },
  {
    id: "body",
    name: "Части тела",
    icon: "🖐️",
    tag: "части тела",
    desc: "С головы до пят.",
    words: `
testa|ˈtɛsta|голова|Copriti la testa, fa freddo!|Cover your head, it is cold!|Одень голову, холодно!
capelli|kaˈpɛlli|волосы|Ho i capelli corti.|I have short hair.|У меня короткие волосы.
occhio|ˈɔkkjo|глаз|Il gatto ha un occhio azzurro e uno verde.|The cat has one blue eye and one green eye.|У кота один глаз голубой, а другой зелёный.
orecchio|oˈrɛkkjo|ухо|Non sento con l'orecchio sinistro.|I don't hear with my left ear.|Я не слышу левым ухом.
naso|ˈnaːzo|нос|Il cane ha il naso bagnato.|The dog has a wet nose.|У собаки мокрый нос.
bocca|ˈbokka|рот|Apri la bocca, per favore.|Open your mouth, please.|Открой рот, пожалуйста.
dente|ˈdɛnte|зуб|Mi lavo i denti tre volte al giorno.|I brush my teeth three times a day.|Я чищу зубы три раза в день.
lingua|ˈliŋɡwa|язык|L'italiano non è una lingua facile.|Italian is not an easy language.|Итальянский — не лёгкий язык.
collo|ˈkɔllo|шея|Mi fa male il collo.|My neck hurts.|У меня болит шея.
spalla|ˈspalla|плечо|Ho una borsa sulla spalla.|I have a bag on my shoulder.|У меня сумка на плече.
braccio|ˈbrattʃo|рука (от плеча до кисти)|Alza il braccio destro!|Raise your right arm!|Подними правую руку!
gomito|ˈdʒoːmito|локоть|Mi fa male il gomito destro.|My right elbow hurts.|У меня болит правый локоть.
polso|ˈpolso|запястье|Mi metto l'orologio al polso.|I put my watch on my wrist.|Я надеваю часы на запястье.
mano|ˈmaːno|рука (кисть)|Dammi la mano!|Give me your hand!|Дай мне руку!
dito|ˈdiːto|палец|Ho un anello sul dito.|I have a ring on my finger.|У меня кольцо на пальце.
unghia|ˈuŋɡja|ноготь|L'unghia del pollice è rotta.|The thumbnail is broken.|Ноготь на большом пальце сломан.
petto|ˈpetto|грудь|Il cuore è nel petto.|The heart is in the chest.|Сердце в груди.
schiena|ˈskjɛːna|спина|Mi fa male la schiena.|My back hurts.|У меня болит спина.
stomaco|ˈstɔːmako|живот|Ho mal di stomaco.|I have a stomachache.|У меня болит живот.
ginocchio|dʒiˈnɔkkjo|колено|Il ginocchio del bambino è sporco.|The child's knee is dirty.|Колено ребёнка грязное.
caviglia|kaˈviʎʎa|лодыжка|Ho una caviglia debole.|I have a weak ankle.|У меня слабая лодыжка.
piede|ˈpjɛːde|ступня, нога|Vado a piedi al lavoro.|I go to work on foot.|Я хожу на работу пешком.
pelle|ˈpɛlle|кожа|La pelle del bambino è morbida.|The child's skin is soft.|Кожа ребёнка мягкая.
cuore|ˈkwoːre|сердце|Il cuore batte nel petto.|The heart beats in the chest.|Сердце бьётся в груди.
sangue|ˈsaŋɡwe|кровь|Il sangue è rosso.|Blood is red.|Кровь красная.
osso|ˈɔsso|кость|Il cane mangia un osso.|The dog eats a bone.|Собака ест кость.
muscolo|ˈmuskolo|мышца|I muscoli delle gambe sono forti.|The leg muscles are strong.|Мышцы ног сильные.
cervello|tʃerˈvɛllo|мозг|Il cervello lavora anche di notte.|The brain works at night too.|Мозг работает и ночью.
  gamba|ˈɡamba| нога| Ho un tatuaggio sulla gamba.| I have a tattoo on my leg.| У меня тату на ноге.
  `,
  },
  {
    id: "proverbs",
    name: "Пословицы и поговорки",
    icon: "💬",
    tag: "пословицы",
    desc: "Народная мудрость с русскими эквивалентами.",
    words: `
Chi va piano, va sano e va lontano.|Тише едешь — дальше будешь
Meglio tardi che mai.|Лучше поздно, чем никогда
Non è tutto oro quello che luccica.|Не всё то золото, что блестит
L'abito non fa il monaco.|Встречают по одёжке
Roma non fu fatta in un giorno.|Рим не сразу строился
Chi cerca, trova.|Кто ищет, тот найдёт
Dove c'è fumo, c'è fuoco.|Нет дыма без огня
Tra il dire e il fare c'è di mezzo il mare.|Между словом и делом — море
Sbagliando s'impara.|На ошибках учатся
Il tempo è denaro.|Время — деньги
A caval donato non si guarda in bocca.|Дарёному коню в зубы не смотрят
Chi dorme non piglia pesci.|Под лежачий камень вода не течёт
Uomo avvisato, mezzo salvato.|Предупреждён — значит вооружён
Chi fa da sé, fa per tre.|Сам сделает — за троих справится
Paese che vai, usanza che trovi.|В чужой монастырь со своим уставом не ходят
  `,
  },
  {
    id: "business",
    name: "Бизнес",
    icon: "💼",
    tag: "бизнес",
    desc: "Лексика офиса, договоров и денег.",
    words: `
azienda|atˈtsjɛnda|компания|Lavoro per una grande azienda.|I work for a big company.|Я работаю в большой компании.
ditta|ˈditta|фирма|È una piccola ditta di famiglia.|It is a small family firm.|Это маленькая семейная фирма.
capo|ˈkaːpo|начальник|Il capo firma i contratti.|The boss signs the contracts.|Начальник подписывает договоры.
dipendente|dipenˈdente|сотрудник|I dipendenti arrivano alle nove.|The employees arrive at nine.|Сотрудники приходят в девять.
cliente|kliˈɛnte|клиент|Il cliente ha sempre ragione.|The customer is always right.|Клиент всегда прав.
fornitore|forniˈtoːre|поставщик|Chiamiamo il fornitore domani.|We are calling the supplier tomorrow.|Мы позвоним поставщику завтра.
contratto|konˈtratto|договор|Il contratto dura due anni.|The contract lasts two years.|Договор длится два года.
riunione|riuˈnjoːne| совещание|La riunione inizia alle dieci.|The meeting starts at ten.|Совещание начинается в десять.
progetto|proˈdʒɛtto|проект|Il progetto è quasi finito.|The project is almost finished.|Проект почти закончен.
scadenza|skaˈdɛntsa| срок|La scadenza è il primo del mese.|The deadline is the first of the month.|Срок — первое число месяца.
stipendio|stiˈpɛndjo|зарплата|Lo stipendio arriva alla fine del mese.|The salary comes at the end of the month.|Зарплата приходит в конце месяца.
aumento|auˈmento|повышение|Chiedo un aumento al capo.|I ask my boss for a raise.|Я прошу начальника о повышении.
assunzione|assunˈtsjoːne| приём на работу|L'assunzione di nuovi dipendenti inizia a marzo.|The hiring of new employees starts in March.|Приём новых сотрудников начинается в марте.
licenziamento|litʃentsjaˈmento|увольнение|Il licenziamento è una cosa difficile.|Dismissal is a difficult thing.|Увольнение — это тяжело.
fattura|fatˈtuːra|счёт-фактура|Invio la fattura al cliente.|I am sending the invoice to the client.|Я отправляю счёт клиенту.
guadagno|ɡwaˈdaɲɲo|прибыль|Il guadagno dell'anno è buono.|The yearly profit is good.|Прибыль за год хорошая.
perdita|ˈpɛrdita|убыток|L'azienda ha una grande perdita.|The company has a big loss.|У компании большой убыток.
mercato|merˈkaːto|рынок|Il mercato italiano è grande.|The Italian market is big.|Итальянский рынок большой.
concorrenza|konkorˈrɛntsa|конкуренция|La concorrenza è molto forte.|The competition is very strong.|Конкуренция очень сильная.
società|sotʃeˈta| компания|La società ha cento dipendenti.|The company has one hundred employees.|В компании сто сотрудников.
capitale|kapiˈtaːle|капитал|L'azienda ha molto capitale.|The company has a lot of capital.|У компании много капитала.
investimento|investiˈmento|инвестиция|Questo investimento è sicuro.|This investment is safe.|Эта инвестиция безопасная.
prestito|ˈprɛstito|кредит|Chiediamo un prestito in banca.|We are asking for a loan at the bank.|Мы просим кредит в банке.
debito|ˈdɛːbito|долг|L'azienda ha molti debiti.|The company has many debts.|У компании много долгов.
tassa|ˈtassa|налог|Le tasse sono alte in Italia.|Taxes are high in Italy.|В Италии налоги высокие.
fatturato|fattuˈraːto|оборот|Il fatturato cresce ogni anno.|The turnover grows every year.|Оборот растёт каждый год.
obiettivo|obdʒetˈtiːvo|цель|Il nostro obiettivo è un nuovo mercato.|Our goal is a new market.|Наша цель — новый рынок.
presentazione|presentatˈtsjoːne|презентация|La presentazione è domani mattina.|The presentation is tomorrow morning.|Презентация завтра утром.
relazione|relatˈtsjoːne| отчёт|Scrivo una relazione per il capo.|I am writing a report for the boss.|Я пишу отчёт для начальника.
scadere|ˈskaːdere|истекать (о сроке)|Il contratto scade a dicembre.|The contract expires in December.|Договор истекает в декабре.
  `,
  },
  {
    id: "it",
    name: "ИТ",
    icon: "💻",
    tag: "ИТ",
    desc: "Компьютеры, интернет и разработка.",
    words: `
computer|komˈpjuter|компьютер|Il computer è nuovo.|The computer is new.|Компьютер новый.
portatile|portaˈtile|ноутбук|Il mio portatile è veloce.|My laptop is fast.|Мой ноутбук быстрый.
schermo|ˈskɛrmo|экран|Lo schermo è rotto.|The screen is broken.|Экран разбит.
tastiera|tasˈtjɛːra|клавиатура|La tastiera del mio computer è italiana.|My computer's keyboard is Italian.|Клавиатура моего компьютера итальянская.
mouse|ˈmaus|мышь|Il mouse non funziona.|The mouse doesn't work.|Мышь не работает.
stampante|stamˈpante|принтер|La stampante è senza carta.|The printer is out of paper.|В принтере нет бумаги.
file|ˈfaile|файл|Il file è troppo grande.|The file is too big.|Файл слишком большой.
cartella|karˈtɛlla|папка|Crea una cartella nuova.|Create a new folder.|Создай новую папку.
programma|proˈɡramma|программа|Questo programma è gratis.|This program is free.|Эта программа бесплатная.
applicazione|applikatˈtsjoːne|приложение|Scarico un'applicazione per imparare l'italiano.|I am downloading an app to learn Italian.|Я скачиваю приложение для изучения итальянского.
sito|ˈsiːto|сайт|Questo sito è in italiano.|This website is in Italian.|Этот сайт на итальянском.
pagina|ˈpaːdʒina|страница|Apri la pagina nel browser.|Open the page in the browser.|Открой страницу в браузере.
collegamento|kolleɡaˈmento|ссылка|Clicca sul collegamento blu.|Click on the blue link.|Кликни на синюю ссылку.
rete|ˈreːte|сеть|La rete non funziona oggi.|The network doesn't work today.|Сеть сегодня не работает.
password|pasˈwɔrd|пароль|La password ha otto caratteri.|The password has eight characters.|В пароле восемь символов.
nome utente|ˈnoːme uˈtɛnte|логин|Il mio nome utente è marco_rossi.|My username is marco_rossi.|Мой логин — marco_rossi.
email|iˈmɛil|почта, письмо|Ricevo cento email al giorno.|I receive a hundred emails a day.|Я получаю сто писем в день.
messaggio|mesˈsaddʒo|сообщение|Mandami un messaggio su WhatsApp.|Send me a message on WhatsApp.|Отправь мне сообщение в WhatsApp.
allegato|alleˈɡaːto|вложение|Il file è nell'allegato.|The file is in the attachment.|Файл во вложении.
scaricare|skariˈkaːre|скачивать|Scarico un film dalla rete.|I am downloading a film from the network.|Я скачиваю фильм из сети.
caricare|kariˈkaːre|загружать|Carico le foto sul sito.|I am uploading the photos to the website.|Я загружаю фото на сайт.
salvare|salˈvaːre|сохранять|Salva il file, per favore.|Save the file, please.|Сохрани файл, пожалуйста.
cancellare|kantʃelˈlaːre|удалять|Cancello i messaggi vecchi.|I delete old messages.|Я удаляю старые сообщения.
copiare|koˈpjaːre|копировать|Copio il testo nel documento.|I am copying the text into the document.|Я копирую текст в документ.
incollare|inkolˈlaːre|вставить|Incollo il testo nella mail.|I paste the text into the email.|Я вставляю текст в письмо.
aggiornamento|addʒornaˈmento|обновление|L'aggiornamento dura dieci minuti.|The update takes ten minutes.|Обновление длится десять минут.
errore|erˈroːre|ошибка|C'è un errore nel codice.|There is an error in the code.|В коде есть ошибка.
codice|ˈkɔːditʃe|код|Il codice di questo programma è lungo.|The code of this program is long.|Код этой программы длинный.
dati|ˈdaːti|данные|I dati sono nel cloud.|The data is in the cloud.|Данные в облаке.
memoria|meˈmɔːrja|память|Il telefono ha poca memoria.|The phone has little memory.|В телефоне мало памяти.
disco|ˈdisko|диск|Il disco è pieno.|The disk is full.|Диск заполнен.
connessione|konneˈssjoːne|соединение, подключение|La connessione è lenta oggi.|The connection is slow today.|Соединение сегодня медленное.
  `,
  },
  {
    id: "travel",
    name: "Путешествия",
    icon: "✈️",
    tag: "путешествия",
    desc: "Аэропорт, отель, транспорт и вопросы туриста.",
    words: `
viaggio|ˈviaddʒo|путешествие|Il viaggio in Italia dura una settimana.|The trip to Italy lasts a week.|Поездка в Италию длится неделю.
vacanza|vaˈkantsa|отпуск, каникулы|Le vacanze estive iniziano a giugno.|The summer holidays start in June.|Летние каникулы начинаются в июне.
biglietto|biʎˈʎɛtto|билет|Un biglietto per Firenze, per favore.|One ticket to Florence, please.|Один билет до Флоренции, пожалуйста.
prenotare|preˈnotaːre|бронировать|Prenotiamo un hotel in centro.|We book a hotel in the center.|Мы бронируем отель в центре.
prenotazione|prenotatˈtsjoːne|бронь|La prenotazione è a nome Rossi.|The booking is in the name of Rossi.|Бронь на имя Росси.
albergo|ˈalberɡo|отель|L'albergo è vicino alla stazione.|The hotel is near the station.|Отель рядом с вокзалом.
ostello|oˈstɛllo|хостел|L'ostello è economico e pulito.|The hostel is cheap and clean.|Хостел дешёвый и чистый.
camera|ˈkaːmera|комната, номер|Abbiamo una camera doppia.|We have a double room.|У нас двухместный номер.
valigia|vaˈliːdʒa|чемодан|Preparo la valigia stasera.|I am packing the suitcase tonight.|Я собираю чемодан сегодня вечером.
bagaglio|baˈɡaʎʎo|багаж|Il bagaglio è pesante.|The luggage is heavy.|Багаж тяжёлый.
passaporto|passaˈpɔrto|паспорт|Mostrami il passaporto, per favore.|Show me your passport, please.|Покажите паспорт, пожалуйста.
dogana|doˈɡaːna|таможня|Passiamo la dogana dopo il volo.|We go through customs after the flight.|Мы проходим таможню после рейса.
aeroporto|aeroˈpɔrto|аэропорт|L'aeroporto è a trenta chilometri dal centro.|The airport is thirty kilometers from the center.|Аэропорт в тридцати километрах от центра.
volo|ˈvoːlo|рейс, полёт|Il volo ha due ore di ritardo.|The flight is two hours late.|Рейс опаздывает на два часа.
aereo|aˈɛːreo|самолёт|L'aereo vola sopra le nuvole.|The plane flies above the clouds.|Самолёт летит над облаками.
treno|ˈtreːno|поезд|Il treno parte dal binario cinque.|The train leaves from platform five.|Поезд отходит с пятого пути.
binario|biˈnaːrjo|платформа, путь|Il treno per Roma è al binario sette.|The train to Rome is on platform seven.|Поезд на Рим на седьмом пути.
stazione|statˈtsjoːne| вокзал|Ci vediamo davanti alla stazione.|Let's meet in front of the station.|Встретимся перед вокзалом.
autobus|ˈautobus|автобус|L'autobus numero 64 va al centro.|Bus number 64 goes to the center.|Автобус номер 64 идёт в центр.
metro|ˈmetro|метро|La metro è veloce e comoda.|The metro is fast and comfortable.|Метро быстрое и удобное.
noleggio|noˈleddʒo|аренда|Il noleggio della macchina costa cinquanta euro al giorno.|The car rental costs fifty euros a day.|Аренда машины стоит пятьдесят евро в день.
mappa|ˈmappa|карта|Compra una mappa della città.|Buy a map of the city.|Купи карту города.
turista|tuˈrista|турист|Roma è piena di turisti.|Rome is full of tourists.|Рим полон туристов.
gita|ˈdʒiːta| поездка|Facciamo una gita al mare.|We are taking a trip to the sea.|Мы едем на вылазку на море.
escursione|eskurˈsjoːne|экскурсия|L'escursione dura tre ore.|The excursion lasts three hours.|Экскурсия длится три часа.
partenza|parˈtɛntsa|отправление|L'orario di partenza è alle otto.|The departure time is at eight.|Время отправления — восемь.
arrivo|arˈriːvo|прибытие|L'arrivo è previsto per mezzogiorno.|The arrival is expected at noon.|Прибытие ожидается в полдень.
ritardo|riˈtardo|задержка, опоздание|Scusa per il ritardo!|Sorry for being late!|Извини за опоздание!
cambio|ˈkambio|обмен|Il cambio è aperto fino alle sei.|The exchange is open until six.|Обмен открыт до шести.
direzione|diretˈtsjoːne|направление|Andiamo nella direzione sbagliata.|We are going in the wrong direction.|Мы идём не в том направлении.
questa settimana|ˈkwesta settiˈmaːna|на этой неделе|Questa settimana vado a Milano.|This week I am going to Milan.|На этой неделе я еду в Милан.
dove è…?|ˈdɔːve ɛ|где находится…?|Dov'è la stazione, per favore?|Where is the station, please?|Где вокзал, пожалуйста?
quanto costa?|ˈkwanto ˈkɔsta| сколько это стоит?|Quanto costa il biglietto?|How much is the ticket?|Сколько стоит билет?
  taxi|ˈtaksi| такси| Il taxi arriva subito.| The taxi arrives right away.| Такси приедет сразу.
  `,
  },
  {
    id: "finance",
    name: "Финансы",
    icon: "💰",
    tag: "финансы",
    desc: "Банки, счета, налоги и инвестиции.",
    words: `
denaro|ˈdeːnaro|деньги|Non ho molto denaro con me.|I don't have much money with me.|У меня нет с собой много денег.
banca|ˈbanka|банк|La banca apre alle nove.|The bank opens at nine.|Банк открывается в девять.
conto|ˈkonto|счёт|Apro un conto in banca.|I open an account at the bank.|Я открываю счёт в банке.
carta di credito|ˈkarta di ˈkrɛdito|кредитная карта|Pago con la carta di credito.|I pay with a credit card.|Я плачу кредитной картой.
bancomat|baŋkoˈmat|банкомат|C'è un bancomat vicino alla banca.|There is an ATM near the bank.|Рядом с банком есть банкомат.
contanti|konˈtanti|наличные|Pago in contanti.|I pay in cash.|Я плачу наличными.
cambio|ˈkambio| курс валют|Qual è il cambio euro-dollaro?|What is the euro-dollar exchange rate?|Какой курс евро к доллару?
prestito|ˈprɛstito|заём, кредит|Il prestito della casa dura vent'anni.|The house loan lasts twenty years.|Кредит на дом длится двадцать лет.
mutuo|ˈmutuo|ипотека|Il mutuo costa ottocento euro al mese.|The mortgage costs eight hundred euros a month.|Ипотека стоит восемьсот евро в месяц.
interesse|interˈɛsse|процент|L'interesse del prestito è basso.|The interest on the loan is low.|Процент по кредиту низкий.
risparmio|risˈparmjo| сбережения|Ho un conto di risparmio.|I have a savings account.|У меня есть сберегательный счёт.
investire|invesˈtiːre|инвестировать|Investiamo i soldi in una piccola azienda.|We invest the money in a small company.|Мы инвестируем деньги в маленькую компанию.
azione|atˈtsjoːne|акция|Le azioni della società salgono.|The company's shares are going up.|Акции компании растут.
borsa|ˈborsa|биржа|La borsa apre alle nove.|The stock exchange opens at nine.|Биржа открывается в девять.
inflazione|inflatˈtsjoːne|инфляция|L'inflazione è alta quest'anno.|Inflation is high this year.|Инфляция в этом году высокая.
tassa|ˈtassa|налог|Pago le tasse ad aprile.|I pay taxes in April.|Я плачу налоги в апреле.
spesa|ˈspeːza| расход|Faccio la spesa il sabato.|I do the shopping on Saturday.|Я делаю покупки по субботам.
guadagno|ɡwaˈdaɲɲo| доход|Il guadagno mensile è di duemila euro.|The monthly income is two thousand euros.|Ежемесячный доход — две тысячи евро.
debito|ˈdɛːbito|долг|Ho un debito con la banca.|I have a debt with the bank.|У меня долг перед банком.
fallimento|falliˈmento|банкротство|La ditta rischia il fallimento.|The firm risks bankruptcy.|Фирма рискует банкротством.
assicurazione|assikuratˈtsjoːne|страховка|L'assicurazione della macchina è obbligatoria.|Car insurance is obligatory.|Страховка машины обязательна.
budget|ˈbaddʒet|бюджет|Il budget del progetto è piccolo.|The project budget is small.|Бюджет проекта маленький.
  `,
  },
  {
    id: "adjectives",
    name: "Прилагательные",
    icon: "📏",
    tag: "прилагательные",
    desc: "Самые ходовые прилагательные для описаний.",
    words: `
grande|ˈɡrande|большой|Hanno una casa grande.|They have a big house.|У них большой дом.
piccolo|ˈpikkolo|маленький|È un hotel piccolo e tranquillo.|It is a small and quiet hotel.|Это маленький и тихий отель.
alto|ˈalto|высокий|La montagna è alta duemila metri.|The mountain is two thousand meters high.|Гора высотой две тысячи метров.
basso|ˈbasso| низкий|Il prezzo è basso, compriamo!|The price is low, let's buy!|Цена низкая, покупаем!
lungo|ˈluŋɡo|длинный|La gonna è troppo lunga.|The skirt is too long.|Юбка слишком длинная.
corto|ˈkorto| короткий|I pantaloni sono troppo corti.|The trousers are too short.|Брюки слишком короткие.
nuovo|ˈnwɔːvo|новый|Il telefono nuovo costa poco.|The new phone costs little.|Новый телефон стоит дёшево.
vecchio|ˈvɛkkjo|старый|Il centro storico è vecchio ma bello.|The old town is old but beautiful.|Старый город старый, но красивый.
giovane|ˈdʒoːvane|молодой|Il nuovo insegnante è molto giovane.|The new teacher is very young.|Новый учитель очень молодой.
bello|ˈbɛllo|красивый|Che tempo bello oggi!|What beautiful weather today!|Какая сегодня прекрасная погода!
brutto|ˈbrutto|некрасивый|Il tempo è brutto, piove.|The weather is bad, it is raining.|Погода плохая, идёт дождь.
buono|ˈbwɔːno| хороший|Il cibo qui è buono e economico.|The food here is good and cheap.|Еда здесь хорошая и дешёвая.
cattivo|katˈtiːvo| плохой|Il cane grande non è cattivo.|The big dog is not mean.|Большая собака не злая.
facile|ˈfaːtʃile|лёгкий, простой|Questa domanda è facile.|This question is easy.|Этот вопрос лёгкий.
difficile|difˈfiːtʃile|трудный|È una parola difficile da pronunciare.|It is a difficult word to pronounce.|Это трудное для произношения слово.
caldo|ˈkaldo| горячий|Il tè è ancora caldo.|The tea is still hot.|Чай ещё горячий.
freddo|ˈfreddo|холодный|Le mani sono fredde.|The hands are cold.|Руки холодные.
veloce|veˈloːtʃe|быстрый|La mia connessione è veloce.|My connection is fast.|Моё соединение быстрое.
lento|ˈlɛnto|медленный|Le tartarughe sono lente.|Turtles are slow.|Черепахи медленные.
forte|ˈfɔrte|сильный|Il caffè espresso è molto forte.|Espresso coffee is very strong.|Эспрессо очень крепкий.
debole|ˈdeːbole|слабый|Il segnale è debole qui.|The signal is weak here.|Здесь слабый сигнал.
pieno|ˈpjɛːno|полный|Il parcheggio è pieno.|The parking lot is full.|Парковка заполнена.
vuoto|ˈvwɔːto|пустой|La bottiglia è vuota.|The bottle is empty.|Бутылка пустая.
caro|ˈkaːro|дорогой|Gli appartamenti qui sono cari.|The apartments here are expensive.|Квартиры здесь дорогие.
economico|ekonoˈmiːko|дешёвый|Questo albergo è economico.|This hotel is cheap.|Этот отель дешёвый.
ricco|ˈrikko|богатый|È una famiglia ricca e famosa.|It is a rich and famous family.|Это богатая и знаменитая семья.
povero|ˈpɔːvero|бедный|Guarda quel povero gatto sotto la pioggia.|Look at that poor cat in the rain.|Посмотри на того бедного кота под дождём.
importante|importaˈnte|важный|È una decisione importante.|It is an important decision.|Это важное решение.
interessante|interesˈsante|интересный|Il museo è molto interessante.|The museum is very interesting.|Музей очень интересный.
noioso|ˈnɔjoːzo|скучный|La lezione di stamattina era noiosa.|This morning's lesson was boring.|Урок сегодня утром был скучным.
pulito|puˈliːto|чистый|La camera dell'albergo è pulita.|The hotel room is clean.|Номер в отеле чистый.
sporco|ˈsporko|грязный|L'auto è sporca dopo il viaggio.|The car is dirty after the trip.|Машина грязная после поездки.
pesante|peˈzante|тяжёлый|La scatola è troppo pesante.|The box is too heavy.|Коробка слишком тяжёлая.
leggero|ˈleddʒero| лёгкий|Questa valigia è leggera.|This suitcase is light.|Этот чемодан лёгкий.
felice|feˈliːtʃe|счастливый|Sono felice per te!|I am happy for you!|Я счастлив за тебя!
triste|ˈtriste|грустный|Perché sei triste oggi?|Why are you sad today?|Почему ты сегодня грустный?
stanco|ˈstanko|уставший|Sono stanco dopo il lavoro.|I am tired after work.|Я устал после работы.
affamato|affaˈmaːto|голодный|I bambini sono affamati dopo la scuola.|The children are hungry after school.|Дети голодные после школы.
gentile|dʒenˈtiːle| добрый|Il personale dell'albergo è molto gentile.|The hotel staff is very kind.|Персонал отеля очень доброжелательный.
simpatico|simˈpaːtiko| приятный|Il tuo amico è molto simpatico.|Your friend is very nice.|Твой друг очень приятный.
  pronto|ˈprɔnto| готовый| Il pranzo è pronto.| Lunch is ready.| Обед готов.
  `,
  },
  {
    id: "colors",
    name: "Цвета",
    icon: "🎨",
    tag: "цвета",
    desc: "Все цвета радуги.",
    words: `
rosso|ˈrosso|красный|La macchina di Marco è rossa.|Marco's car is red.|Машина Марко красная.
blu|blu|синий|Il mare è blu oggi.|The sea is blue today.|Море сегодня синее.
azzurro|atˈtsurro|голубой|Il cielo è azzurro d'estate.|The sky is light blue in summer.|Летом небо голубое.
verde|ˈvɛrde|зелёный|Il semaforo è verde.|The traffic light is green.|Светофор зелёный.
giallo|ˈdʒallo|жёлтый|I limoni sono gialli.|Lemons are yellow.|Лимоны жёлтые.
arancione|arantˈʃoːne|оранжевый|Le arance sono arancioni.|Oranges are orange.|Апельсины оранжевые.
viola|ˈvjɔːla|фиолетовый|Il mio colore preferito è il viola.|My favorite color is purple.|Мой любимый цвет — фиолетовый.
rosa|ˈrɔːza|розовый|La rosa è un fiore rosa.|The rose is a pink flower.|Роза — розовый цветок.
marrone|marˈroːne|коричневый|L'orso è marrone.|The bear is brown.|Медведь коричневый.
nero|ˈneːro|чёрный|Il gatto della nonna è nero.|Grandma's cat is black.|Кот бабушки чёрный.
bianco|ˈbjanko|белый|La neve è bianca.|The snow is white.|Снег белый.
grigio|ˈɡriːdʒo|серый|Il cielo è grigio oggi.|The sky is grey today.|Небо сегодня серое.
dorato|doˈraːto|золотой|L'anello dorato è della nonna.|The golden ring is grandma's.|Золотое кольцо — бабушкино.
argenteo|ardʒenˈteːo|серебряный|La luna è argentea stanotte.|The moon is silver tonight.|Луна сегодня серебряная.
chiaro|ˈkjaːro|светлый|La mia stanza è blu chiaro.|My room is light blue.|Моя комната светло-голубая.
scuro|ˈskuːro|тёмный|Preferisco il verde scuro.|I prefer dark green.|Я предпочитаю тёмно-зелёный.
  `,
  },
  {
    id: "numbers",
    name: "Цифры",
    icon: "🔢",
    tag: "цифры",
    desc: "Количественные и порядковые числительные.",
    words: `
zero|ˈdzɛːro|ноль|Il termometro segna zero gradi.|The thermometer shows zero degrees.|Термометр показывает ноль градусов.
uno|ˈuːno|один|Ho solo un euro.|I have only one euro.|У меня всего один евро.
due|ˈduːe|два|Ho due biglietti per il concerto.|I have two tickets to the concert.|У меня два билета на концерт.
tre|tre|три|La famiglia è di tre persone.|The family is three people.|В семье три человека.
quattro|ˈkwattro|четыре|Il tavolo ha quattro gambe.|The table has four legs.|У стола четыре ножки.
cinque|ˈtʃinkwe|пять|Il negozio apre alle cinque.|The shop opens at five.|Магазин открывается в пять.
sei|sɛi|шесть|Mio figlio ha sei anni.|My son is six years old.|Моему сыну шесть лет.
sette|ˈsɛtte|семь|Mi sveglio alle sette.|I wake up at seven.|Я просыпаюсь в семь.
otto|ˈɔtto|восемь|Il film inizia alle otto.|The film starts at eight.|Фильм начинается в восемь.
nove|ˈnɔːve|девять|Il treno parte alle nove e trenta.|The train leaves at nine thirty.|Поезд отправляется в девять тридцать.
dieci|ˈdjɛːtʃi|десять|Sono le dieci di mattina.|It is ten in the morning.|Сейчас десять утра.
undici|ˈunditʃi|одиннадцать|Il negozio chiude alle undici.|The shop closes at eleven.|Магазин закрывается в одиннадцать.
dodici|ˈdɔːditʃi|двенадцать|A mezzogiorno sono le dodici.|At noon it is twelve o'clock.|В полдень двенадцать часов.
tredici|ˈtreːditʃi|тринадцать|Il ragazzo ha tredici anni.|The boy is thirteen years old.|Мальчику тринадцать лет.
quattordici|kwatˈtɔrditʃi|четырнадцать|Il viaggio dura quattordici giorni.|The trip lasts fourteen days.|Поездка длится четырнадцать дней.
quindici|ˈkwinditʃi|пятнадцать|Il biglietto costa quindici euro.|The ticket costs fifteen euros.|Билет стоит пятнадцать евро.
sedici|ˈseːditʃi|шестнадцать|Mia cugina ha sedici anni.|My cousin is sixteen years old.|Моей двоюродной сестре шестнадцать лет.
diciassette|ditʃasˈsɛtte|семнадцать|Il conto è di diciassette euro.|The bill is seventeen euros.|Счёт — семнадцать евро.
diciotto|diˈtʃɔtto|восемнадцать|Mio fratello ha diciotto anni.|My brother is eighteen years old.|Моему брату восемнадцать лет.
diciannove|ditʃanˈnoːve|девятнадцать|La macchina costa diciannove mila euro.|The car costs nineteen thousand euros.|Машина стоит девятнадцать тысяч евро.
venti|ˈvɛnti|двадцать|Ho solo venti euro in tasca.|I have only twenty euros in my pocket.|У меня в кармане всего двадцать евро.
trenta|ˈtrenta|тридцать|La lezione dura trenta minuti.|The lesson lasts thirty minutes.|Урок длится тридцать минут.
quaranta|kwaˈranta|сорок|Il mio papà ha quarant'anni.|My dad is forty years old.|Моему папе сорок лет.
cinquanta|tʃinˈkwanta|пятьдесят|La bicicletta costa cinquanta euro.|The bicycle costs fifty euros.|Велосипед стоит пятьдесят евро.
sessanta|sesˈsanta|шестьдесят|La nonna ha sessanta anni.|Grandma is sixty years old.|Бабушке шестьдесят лет.
settanta|setˈtanta|семьдесят|Il nonno ha settanta anni.|Grandpa is seventy years old.|Дедушке семьдесят лет.
ottanta|otˈtanta|восемьдесят|Il nonno ha quasi ottanta anni.|Grandpa is almost eighty years old.|Дедушке почти восемьдесят лет.
novanta|noˈvanta|девяносто|Il viaggio dura novanta minuti.|The trip lasts ninety minutes.|Поездка длится девяносто минут.
cento|ˈtʃɛnto|сто|Il corso dura cento ore.|The course lasts a hundred hours.|Курс длится сто часов.
mille|ˈmille|тысяча|Il telefono costa mille euro.|The phone costs a thousand euros.|Телефон стоит тысячу евро.
un milione|un miˈljoːne|миллион|Milano ha più di un milione di abitanti.|Milan has more than a million inhabitants.|В Милане больше миллиона жителей.
primo|ˈpriːmo|первый|Il primo autobus passa alle sei.|The first bus comes at six.|Первый автобус идёт в шесть.
secondo|seˈkondo|второй|Il secondo piatto è la carne.|The second course is meat.|Второе блюдо — мясо.
terzo|ˈtɛrtso|третий|Abito al terzo piano.|I live on the third floor.|Я живу на третьем этаже.
mezzo|ˈmɛddzo| полдня|Ho una mezza giornata libera.|I have half a day free.|У меня свободна половина дня.
doppio|ˈdoppjo|двойной|Vorrei un caffè doppio, per favore.|I'd like a double espresso, please.|Двойной эспрессо, пожалуйста.
la metà|la meˈta|половина|La metà del lavoro è finita.|Half of the work is done.|Половина работы сделана.
  `,
  },
  {
    id: "sport",
    name: "Спорт",
    icon: "⚽",
    tag: "спорт",
    desc: "Лексика спорта: от мяча до чемпионата.",
    words: `
calcio|ˈkaltʃo|футбол|Il calcio è lo sport più popolare d'Italia.|Football is the most popular sport in Italy.|Футбол — самый популярный спорт в Италии.
partita|parˈtiːta|матч|La partita inizia alle nove.|The match starts at nine.|Матч начинается в девять.
squadra|ˈskwadra|команда|La mia squadra gioca stasera.|My team is playing tonight.|Моя команда играет сегодня вечером.
giocatore|dʒokaˈtoːre|игрок|Il giocatore segna un gol.|The player scores a goal.|Игрок забивает гол.
allenatore|allenaˈtoːre|тренер|L'allenatore parla con la squadra.|The coach talks to the team.|Тренер разговаривает с командой.
porta|ˈpɔrta| ворота|Il pallone entra in porta.|The ball goes into the goal.|Мяч попадает в ворота.
portiere|porˈtjɛːre|вратарь|Il portiere salva la squadra.|The goalkeeper saves the team.|Вратарь спасает команду.
gol|ɡɔl| гол|Che gol bellissimo!|What a beautiful goal!|Какой красивый гол!
palla|ˈpalla|мяч|Il cane corre dietro alla palla.|The dog runs after the ball.|Собака бежит за мячом.
campo|ˈkampo|поле, корт|Il campo da calcio è grande.|The football field is big.|Футбольное поле большое.
gara|ˈɡaːra|соревнование|La gara inizia alle dieci.|The race starts at ten.|Соревнование начинается в десять.
punto|ˈpunto|очко|La mia squadra ha trenta punti.|My team has thirty points.|У моей команды тридцать очков.
campionato|kampjoˈnaːto|чемпионат|Il campionato dura fino a maggio.|The championship lasts until May.|Чемпионат длится до мая.
coppa|ˈkoppa|кубок|La squadra vince la coppa.|The team wins the cup.|Команда выигрывает кубок.
tifoso|tiˈfoːzo|болельщик|I tifosi cantano allo stadio.|The fans sing at the stadium.|Болельщики поют на стадионе.
tifo per…|ˈtiːfo per| болеть за|Tifo per la Juventus.|I support Juventus.|Я болею за «Ювентус».
allenamento|allenaˈmento|тренировка|L'allenamento dura due ore.|The training lasts two hours.|Тренировка длится два часа.
nuoto|ˈnwɔːto|плавание|Il nuoto è buonissimo per la salute.|Swimming is very good for health.|Плавание очень полезно для здоровья.
pallacanestro|pallakaneˈstro|баскетбол|Gioco a pallacanestro con gli amici.|I play basketball with friends.|Я играю в баскетбол с друзьями.
pallavolo|pallaˈvoːlo|волейбол|La pallavolo è uno sport di squadra.|Volleyball is a team sport.|Волейбол — командный спорт.
sci|ʃi|лыжи|Lo sci è uno sport invernale.|Skiing is a winter sport.|Лыжи — зимний спорт.
medaglia|meˈdaʎʎa|медаль|Il campione riceve una medaglia d'oro.|The champion receives a gold medal.|Чемпион получает золотую медаль.
record|reˈkɔrd|рекорд|Il nuotatore batte il record del mondo.|The swimmer breaks the world record.|Пловец бьёт мировой рекорд.
vincere|ˈvintʃere|побеждать|Vincere non è tutto.|Winning is not everything.|Победа — не главное.
perdere|ˈpɛrdere|проигрывать|La squadra perde la partita.|The team loses the match.|Команда проигрывает матч.
pareggio|paˈrɛddʒo|ничья|La partita finisce in pareggio.|The match ends in a draw.|Матч заканчивается ничьей.
  corsa|ˈkɔrsa| гонка, забег| La corsa dura un’ora.| The race lasts an hour.| Гонка длится час.
  `,
  },
  {
    id: "key-verbs",
    name: "20 ключевых глаголов",
    icon: "🎯",
    tag: "ключевые глаголы",
    desc: "Главные глаголы языка: на карточке всё настоящее время (io → loro).",
    size: 20,
    words: `
essere — sono, sei, è, siamo, siete, sono|ˈɛssere|быть|Siamo amici da molti anni.|We have been friends for many years.|Мы друзья уже много лет.
avere — ho, hai, ha, abbiamo, avete, hanno|aˈveːre|иметь|Ho due fratelli e una sorella.|I have two brothers and a sister.|У меня два брата и сестра.
fare — faccio, fai, fa, facciamo, fate, fanno|ˈfaːre|делать|Faccio colazione alle sette.|I have breakfast at seven.|Я завтракаю в семь.
dire — dico, dici, dice, diciamo, dite, dicono|ˈdiːre|говорить|Dico sempre la verità.|I always tell the truth.|Я всегда говорю правду.
andare — vado, vai, va, andiamo, andate, vanno|anˈdaːre|идти, ехать|Andiamo al cinema ogni sabato.|We go to the cinema every Saturday.|Мы ходим в кино каждую субботу.
venire — vengo, vieni, viene, veniamo, venite, vengono|veˈniːre|приходить|Vieni alla festa stasera?|Are you coming to the party tonight?|Ты идёшь сегодня на вечеринку?
dare — do, dai, dà, diamo, date, danno|ˈdaːre|давать|Do un libro a Marco.|I give a book to Marco.|Я даю книгу Марко.
stare — sto, stai, sta, stiamo, state, stanno|ˈstaːre|находиться; быть (о состоянии)|Sto bene, grazie.|I am fine, thanks.|Я хорошо, спасибо.
potere — posso, puoi, può, possiamo, potete, possono|poˈteːre|мочь|Non posso venire domani.|I cannot come tomorrow.|Я не могу прийти завтра.
volere — voglio, vuoi, vuole, vogliamo, volete, vogliono|voˈleːre|хотеть|Voglio imparare l'italiano.|I want to learn Italian.|Я хочу выучить итальянский.
dovere — devo, devi, deve, dobbiamo, dovete, devono|doˈveːre|быть должным; быть обязанным|Devo studiare stasera.|I have to study tonight.|Я должен заниматься сегодня вечером.
sapere — so, sai, sa, sappiamo, sapete, sanno|saˈpeːre|знать; уметь|So parlare tre lingue.|I can speak three languages.|Я умею говорить на трёх языках.
vedere — vedo, vedi, vede, vediamo, vedete, vedono|veˈdeːre|видеть|Vediamo il mare dalla finestra.|We see the sea from the window.|Мы видим море из окна.
prendere — prendo, prendi, prende, prendiamo, prendete, prendono|ˈprɛndere|брать; принимать|Prendo il treno delle otto.|I take the eight o'clock train.|Я еду восьмичасовым поездом.
mettere — metto, metti, mette, mettiamo, mettete, mettono|ˈmettere|класть; надевать|Metto il libro nello zaino.|I put the book in the backpack.|Я кладу книгу в рюкзак.
uscire — esco, esci, esce, usciamo, uscite, escono|uʃˈʃiːre|выходить|Usciamo con gli amici la sera.|We go out with friends in the evening.|Мы выходим гулять с друзьями вечером.
rimanere — rimango, rimani, rimane, rimaniamo, rimanete, rimangono|rimaˈneːre|оставаться|Rimango a casa la domenica.|I stay home on Sundays.|Я остаюсь дома по воскресеньям.
tenere — tengo, tieni, tiene, teniamo, tenete, tengono|ˈteːnere|держать|Tengo il gatto in braccio.|I hold the cat in my arms.|Я держу кота на руках.
bere — bevo, bevi, beve, beviamo, bevete, bevono|ˈbeːre|пить|Beviamo un caffè insieme.|We have a coffee together.|Мы пьём кофе вместе.
scrivere — scrivo, scrivi, scrive, scriviamo, scrivete, scrivono|ˈskriːvere|писать|Scrivo un messaggio ad Anna.|I write a message to Anna.|Я пишу сообщение Анне.
  `,
  },

];
})();

// Данные готовых наборов слов: английский.
// Формат строки слов:
//   слово|транскрипция (МФА)|перевод|пример на языке набора|пример на втором языке|перевод примера на русский
// Примеры необязательны; у пословиц их нет — карточка сама является фразой.
// Уровень примеров A1–A2; языковая пара примеров — взаимные переводы.
// Метаданные группы: id, name, icon, tag, desc, size?; lang добавляет загрузчик (groups-data.js).
window.WM = window.WM || {};

(() => {
// частотное ядро (300 слов) — основа набора «300 самых частотных слов»
const CORE_TOP = `
the|ðə| определённый артикль|The book is on the table.|Il libro è sul tavolo.|Книга на столе.
a|ə| неопределённый артикль|I have a new backpack.|Ho uno zaino nuovo.|У меня новый рюкзак.
an|æn| неопределённый артикль (перед гласной)|I eat an egg for breakfast.|Mangio un uovo a colazione.|Я ем яйцо на завтрак.
and|ænd|и|Marco and Luca are friends.|Marco e Luca sono amici.|Марко и Лука — друзья.
or|ɔːr|или|Do you want tea or coffee?|Vuoi tè o caffè?|Хочешь чай или кофе?
but|bʌt|но|I want to come, but I am tired.|Voglio venire, ma sono stanco.|Я хочу прийти, но я устал.
if|ɪf| если|If it rains, I stay home.|Se piove, resto a casa.|Если идёт дождь, я остаюсь дома.
because|bɪˈkɔːz| потому что|I stay home because I am tired.|Resto a casa perché sono stanco.|Я остаюсь дома, потому что я устал.
not|nɑːt|не|I do not understand it.|Non lo capisco.|Я не понимаю этого.
yes|jɛs|да|Yes, you are right.|Sì, hai ragione.|Да, ты прав.
no|noʊ|нет|No, thanks.|No, grazie.|Нет, спасибо.
please|pliːz| пожалуйста|A coffee, please.|Un caffè, per favore.|Кофе, пожалуйста.
thank you|ˈθæŋk juː|спасибо|Thank you for your help!|Grazie per il tuo aiuto!|Спасибо за твою помощь!
sorry|ˈsɑːri| извини|Sorry, I am late!|Scusa, sono in ritardo!|Извини, я опаздываю!
hello|həˈloʊ| здравствуй|Hello, how are you?|Ciao, come stai?|Привет, как дела?
I|aɪ|я|I work, you study.|Io lavoro, tu studi.|Я работаю, ты учишься.
you|juː| ты|And you, how are you?|E tu, come stai?|А ты как?
he|hiː|он|He is my brother.|Lui è mio fratello.|Он мой брат.
she|ʃiː| она|She is my sister.|Lei è mia sorella.|Она моя сестра.
it|ɪt| оно, это|It is very hot today.|Fa molto caldo oggi.|Сегодня очень жарко.
we|wiː|мы|We live in Milan.|Noi abitiamo a Milano.|Мы живём в Милане.
they|ðeɪ|они|They don't speak Italian.|Loro non parlano italiano.|Они не говорят по-итальянски.
this|ðɪs|это, этот|This book is interesting.|Questo libro è interessante.|Эта книга интересная.
that|ðæt| тот|That house is old.|Quella casa è vecchia.|Тот дом старый.
here|hɪr|здесь|Come here, please.|Vieni qui, per favore.|Иди сюда, пожалуйста.
there|ðɛr|там|The books are there, on the table.|I libri sono lì, sul tavolo.|Книги там, на столе.
now|naʊ|сейчас|I can't talk right now.|Adesso non posso parlare.|Я сейчас не могу говорить.
today|təˈdeɪ|сегодня|Today I am staying home.|Oggi resto a casa.|Сегодня я остаюсь дома.
yesterday|ˈjɛstərdeɪ|вчера|I saw Marco yesterday.|Ieri ho visto Marco.|Вчера я видел Марко.
tomorrow|təˈmɑːroʊ|завтра|Tomorrow I am going to the sea.|Domani vado al mare.|Завтра я еду на море.
always|ˈɔːlweɪz|всегда|Marco is always late.|Marco è sempre in ritardo.|Марко всегда опаздывает.
never|ˈnɛvər|никогда|I never eat meat.|Non mangio mai la carne.|Я никогда не ем мясо.
often|ˈɔːfən|часто|I often walk to work.|Spesso vado a piedi al lavoro.|Я часто хожу на работу пешком.
very|ˈvɛri| очень|You are very kind!|Sei molto gentile!|Ты очень добрый!
much|mʌtʃ| много|I don't have much time.|Non ho molto tempo.|У меня нет много времени.
many|ˈmɛni|много (с исчисляемыми)|There are many people in the city.|In città ci sono tante persone.|В городе много людей.
little|ˈlɪtəl| мало|I have little time today.|Ho poco tempo oggi.|У меня мало времени сегодня.
all|ɔːl| все|All my friends are here.|Tutti i miei amici sono qui.|Все мои друзья здесь.
nothing|ˈnʌθɪŋ| ничто|There is nothing in the fridge.|Non c'è niente nel frigorifero.|В холодильнике ничего нет.
something|ˈsʌmθɪŋ|что-то|I want to tell you something.|Voglio dirti qualcosa.|Я хочу тебе кое-что сказать.
somebody|ˈsʌmˌbɑːdi|кто-то|There is someone at the door.|C'è qualcuno alla porta.|У двери кто-то есть.
one|wʌn|один|I have only one euro.|Ho solo un euro.|У меня всего один евро.
two|tuː|два|I have two cats.|Ho due gatti.|У меня два кота.
three|θriː|три|The train leaves at three.|Il treno parte alle tre.|Поезд отправляется в три.
house|haʊs|дом|Our house is near the park.|La nostra casa è vicino al parco.|Наш дом рядом с парком.
water|ˈwɔːtər|вода|I drink two liters of water a day.|Bevo due litri d'acqua al giorno.|Я пью два литра воды в день.
day|deɪ|день|What day is it today?|Che giorno è oggi?|Какой сегодня день?
night|naɪt|ночь|At night I sleep well.|La notte dormo bene.|Ночью я сплю хорошо.
evening|ˈiːvnɪŋ|вечер|In the evening I watch TV.|La sera guardo la TV.|Вечером я смотрю телевизор.
morning|ˈmɔːrnɪŋ|утро|In the morning I drink a coffee.|La mattina bevo un caffè.|Утром я пью кофе.
year|jɪr|год|Happy New Year!|Buon anno nuovo!|С Новым годом!
month|mʌnθ|месяц|This month I am working a lot.|Questo mese lavoro molto.|В этом месяце я много работаю.
week|wiːk|неделя|I'll see you next week.|Ti vedo la prossima settimana.|Увидимся на следующей неделе.
time|taɪm| время|I don't have time now.|Non ho tempo adesso.|У меня сейчас нет времени.
city|ˈsɪti|город|Rome is a very beautiful city.|Roma è una città bellissima.|Рим — очень красивый город.
country|ˈkʌntri| страна|Italy is a very beautiful country.|L'Italia è un paese bellissimo.|Италия — очень красивая страна.
man|mæn|мужчина, человек|That man is my father.|Quell'uomo è mio padre.|Тот мужчина — мой отец.
woman|ˈwʊmən|женщина|That woman is my teacher.|Quella donna è la mia professoressa.|Та женщина — моя преподавательница.
child|tʃaɪld|ребёнок|The child is playing in the park.|Il bambino gioca nel parco.|Ребёнок играет в парке.
friend|frend|друг|Marco is my best friend.|Marco è il mio migliore amico.|Марко — мой лучший друг.
mother|ˈmʌðər| мать|My mother cooks very well.|Mia madre cucina molto bene.|Моя мама готовит очень хорошо.
father|ˈfɑːðər| отец|My father works in a bank.|Mio padre lavora in banca.|Мой папа работает в банке.
hand|hænd|рука (кисть)|I write with my right hand.|Scrivo con la mano destra.|Я пишу правой рукой.
eye|aɪ|глаз|I have something in my eye.|Ho qualcosa nell'occhio.|У меня что-то в глазу.
head|hɛd|голова|My head hurts.|Mi fa male la testa.|У меня болит голова.
food|fuːd|еда|Italian food is delicious.|Il cibo italiano è delizioso.|Итальянская еда очень вкусная.
bread|brɛd|хлеб|I buy bread every morning.|Compro il pane ogni mattina.|Я покупаю хлеб каждое утро.
wine|waɪn|вино|This wine is very good.|Questo vino è molto buono.|Это вино очень хорошее.
coffee|ˈkɔːfi|кофе|Do you want a coffee?|Vuoi un caffè?|Хочешь кофе?
money|ˈmʌni|деньги|I don't have money with me.|Non ho soldi con me.|У меня нет с собой денег.
work|wɜːrk|работа|My job is interesting.|Il mio lavoro è interessante.|Моя работа интересная.
school|skuːl|школа|My children go to school.|I miei figli vanno a scuola.|Мои дети ходят в школу.
book|bʊk|книга|This book is Marco's.|Questo libro è di Marco.|Эта книга Марко.
word|wɜːrd|слово|I don't know this word.|Non conosco questa parola.|Я не знаю это слово.
name|neɪm|имя|Write your name here, please.|Scrivi il tuo nome qui, per favore.|Напиши своё имя здесь, пожалуйста.
life|laɪf|жизнь|Life in Rome is beautiful.|La vita a Roma è bella.|Жизнь в Риме прекрасна.
world|wɜːrld|мир|The world is big.|Il mondo è grande.|Мир большой.
part|pɑːrt|часть|This is my favorite part of the film.|Questa è la mia parte preferita del film.|Это моя любимая часть фильма.
way|weɪ| путь, способ|There is no other way.|Non c'è un altro modo.|Другого способа нет.
thing|θɪŋ| вещь|I always forget my things.|Dimentico sempre le mie cose.|Я всегда забываю свои вещи.
place|pleɪs|место|Is this seat free?|Questo posto è libero?|Это место свободно?
love|lʌv| любовь|Love is important in life.|L'amore è importante nella vita.|Любовь важна в жизни.
family|ˈfæməli|семья|My family lives in Moscow.|La mia famiglia abita a Mosca.|Моя семья живёт в Москве.
maybe|ˈmeɪbi| может быть|Maybe it will rain tomorrow.|Forse domani piove.|Может быть, завтра будет дождь.
good|ɡʊd|хороший|The food here is good and cheap.|Il cibo qui è buono e economico.|Еда здесь хорошая и дешёвая.
bad|bæd|плохой|The weather is bad, it is raining.|Il tempo è brutto, piove.|Погода плохая, идёт дождь.
OK|oʊˈkeɪ| ладно|OK, see you tomorrow!|Va bene, ci vediamo domani!|Ладно, увидимся завтра!
people|ˈpiːpəl|люди|There are many people in the square.|In piazza ci sono tante persone.|На площади много людей.
true|truː|правда, верный|It is true, you are right.|È vero, hai ragione.|Это правда, ты прав.
right|raɪt| право, направо|Turn right at the corner.|Gira a destra all'angolo.|Поверни направо на углу.
wrong|rɔːŋ|неправильный|We are going in the wrong direction.|Andiamo nella direzione sbagliata.|Мы идём не в том направлении.
what|wʌt| что|What time is it?|Che ora è?|Который час?
who|huː| кто|Who is that woman?|Chi è quella donna?|Кто та женщина?
why|waɪ| почему|Why do you study Italian?|Perché studi l'italiano?|Почему ты учишь итальянский?
everyone|ˈɛvriwʌn| каждый, все|Everyone is happy today.|Tutti sono felici oggi.|Сегодня все счастливы.
still|stɪl| всё ещё|The tea is still hot.|Il tè è ancora caldo.|Чай ещё горячий.
be|biː|быть|I am a student.|Sono studente.|Я студент.
have|hæv|иметь|I have a sister.|Ho una sorella.|У меня есть сестра.
do|duː|делать|What do you do in the evening?|Che fai la sera?|Что ты делаешь вечером?
say|seɪ|сказать|Say it again, please.|Dillo di nuovo, per favore.|Скажи это ещё раз, пожалуйста.
go|ɡoʊ|идти, ехать|I go to school by bike.|Vado a scuola in bicicletta.|Я езжу в школу на велосипеде.
can|kæn|мочь|Can I open the window?|Posso aprire la finestra?|Можно открыть окно?
get|ɡet| получать, добираться|I get many emails every day.|Ricevo tante email ogni giorno.|Я получаю много писем каждый день.
make|meɪk| делать, создавать|I make breakfast every morning.|Preparo la colazione ogni mattina.|Я готовлю завтрак каждое утро.
know|noʊ|знать|I don't know.|Non lo so.|Я не знаю.
think|θɪŋk|думать|I often think about you.|Penso spesso a te.|Я часто думаю о тебе.
take|teɪk|брать|Take an umbrella, it is raining.|Prendi un ombrello, piove.|Возьми зонт, идёт дождь.
see|siː|видеть|I see the sea from the window.|Vedo il mare dalla finestra.|Я вижу море из окна.
come|kʌm|приходить|Come to my house!|Vieni a casa mia!|Приходи ко мне домой!
want|wɑːnt|хотеть|I want an ice cream.|Voglio un gelato.|Я хочу мороженое.
look|lʊk|смотреть|I look at the stars at night.|Guardo le stelle di notte.|Я смотрю на звёзды ночью.
use|juːz| использовать|Can I use your phone?|Posso usare il tuo telefono?|Можно воспользоваться твоим телефоном?
find|faɪnd|находить|I can't find the keys.|Non trovo le chiavi.|Не могу найти ключи.
give|ɡɪv|давать|Give the book to Marco.|Dai il libro a Marco.|Дай книгу Марко.
tell|tel|рассказывать|Grandma tells a story.|La nonna racconta una storia.|Бабушка рассказывает историю.
call|kɔːl| звонить, называть|Call me tonight, please.|Chiamami stasera, per favore.|Позвони мне сегодня вечером, пожалуйста.
try|traɪ| пытаться|I try to learn ten words a day.|Provo a imparare dieci parole al giorno.|Я стараюсь учить десять слов в день.
ask|æsk|спрашивать|I ask for information at the station.|Chiedo informazioni in stazione.|Я спрашиваю информацию на вокзале.
need|niːd| нужно, требоваться|I need some help.|Mi serve un aiuto.|Мне нужна помощь.
feel|fiːl| чувствовать|How do you feel today?|Come ti senti oggi?|Как ты себя чувствуешь сегодня?
become|bɪˈkʌm|становиться|My sister is becoming a doctor.|Mia sorella diventa medico.|Моя сестра становится врачом.
leave|liːv| уходить, оставлять|I leave the house at eight.|Esco di casa alle otto.|Я выхожу из дома в восемь.
put|pʊt| класть|I put the book on the table.|Metto il libro sul tavolo.|Я кладу книгу на стол.
keep|kiːp| хранить, держать|I keep my money in the bank.|Tengo i soldi in banca.|Я храню деньги в банке.
begin|bɪˈɡɪn|начинать|The lesson begins at nine.|La lezione inizia alle nove.|Урок начинается в девять.
seem|siːm| казаться|He seems like a kind person.|Sembra una persona gentile.|Он кажется добрым человеком.
help|help| помогать|I help my mother in the kitchen.|Aiuto mia madre in cucina.|Я помогаю маме на кухне.
talk|tɔːk|разговаривать|We talk about work every day.|Parliamo di lavoro ogni giorno.|Мы разговариваем о работе каждый день.
start|stɑːrt|начинать|The film starts at eight.|Il film inizia alle otto.|Фильм начинается в восемь.
show|ʃoʊ| показывать|I will show you my city.|Ti mostro la mia città.|Я покажу тебе мой город.
hear|hɪr| слышать|I hear a strange noise.|Sento un rumore strano.|Я слышу странный шум.
play|pleɪ| играть|I play the guitar.|Suono la chitarra.|Я играю на гитаре.
run|rʌn| бегать|I run in the park every morning.|Corro nel parco ogni mattina.|Я бегаю в парке каждое утро.
move|muːv| двигать(ся)|We move to a new house.|Ci trasferiamo in una casa nuova.|Мы переезжаем в новый дом.
like|laɪk| нравиться|I like pizza.|Mi piace la pizza.|Мне нравится пицца.
live|lɪv|жить|I have lived in Rome for ten years.|Vivo a Roma da dieci anni.|Я живу в Риме десять лет.
bring|brɪŋ| приносить|I am bringing a present for Anna.|Porto un regalo ad Anna.|Я приношу подарок Анне.
write|raɪt|писать|I write a letter to grandma.|Scrivo una lettera alla nonna.|Я пишу письмо бабушке.
pay|peɪ| платить|Who is paying the bill?|Chi paga il conto?|Кто платит по счёту?
continue|kənˈtɪnjuː|продолжать|The road continues for two kilometers.|La strada continua per due chilometri.|Дорога продолжается два километра.
learn|lɜːrn| учить|I learn new words every day.|Imparo parole nuove ogni giorno.|Я учу новые слова каждый день.
change|tʃeɪndʒ| менять|I want to change my plans.|Voglio cambiare i miei piani.|Я хочу поменять свои планы.
understand|ˌʌndərˈstænd|понимать|I don't understand this word.|Non capisco questa parola.|Я не понимаю это слово.
stop|stɑːp| останавливать(ся)|The bus stops at the corner.|L'autobus si ferma all'angolo.|Автобус останавливается на углу.
create|kriˈeɪt| создавать|They create a new website.|Creano un sito nuovo.|Они создают новый сайт.
speak|spiːk| говорить|I speak Italian and a little English.|Parlo italiano e un po' d'inglese.|Я говорю по-итальянски и немного по-английски.
read|riːd|читать|I read a book every month.|Leggo un libro ogni mese.|Я читаю книгу каждый месяц.
walk|wɔːk| гулять|I walk half an hour every day.|Cammino mezz'ora ogni giorno.|Я хожу пешком полчаса каждый день.
teach|tiːtʃ| учить (кого-то)|I teach English at a school.|Insegno inglese in una scuola.|Я преподаю английский в школе.
offer|ˈɔːfər| предлагать|I offer you a coffee.|Ti offro un caffè.|Я угощаю тебя кофе.
remember|rɪˈmembər|помнить|I don't remember his name.|Non ricordo il suo nome.|Я не помню его имя.
die|daɪ| умирать|Plants die without water.|Le piante muoiono senza acqua.|Растения умирают без воды.
stay|steɪ|оставаться|I am staying home today.|Rimango a casa oggi.|Я остаюсь сегодня дома.
pass|pæs| проходить|Pass me the salt, please.|Passami il sale, per favore.|Передай мне соль, пожалуйста.
break|breɪk| ломать|The glass breaks easily.|Il vetro si rompe facilmente.|Стекло легко бьётся.
receive|rɪˈsiːv| получать|I receive many emails at work.|Ricevo tante email al lavoro.|Я получаю много писем на работе.
brother|ˈbrʌðər|брат|My brother is ten years old.|Mio fratello ha dieci anni.|Моему брату десять лет.
sister|ˈsɪstər|сестра|My sister lives in Turin.|Mia sorella abita a Torino.|Моя сестра живёт в Турине.
son|sʌn|сын|Anna's son is called Paolo.|Il figlio di Anna si chiama Paolo.|Сына Анны зовут Паоло.
daughter|ˈdɔːtər|дочь|Their daughter is five years old.|La loro figlia ha cinque anni.|Их дочери пять лет.
husband|ˈhʌzbənd|муж|Her husband is a cook.|Suo marito è cuoco.|Её муж — повар.
wife|waɪf|жена|Marco's wife is a doctor.|La moglie di Marco è medico.|Жена Марко — врач.
boy|bɔɪ|мальчик, парень|The boy is playing football.|Il ragazzo gioca a calcio.|Мальчик играет в футбол.
girl|ɡɜːrl| девочка|The girl is reading a book.|La ragazza legge un libro.|Девочка читает книгу.
milk|mɪlk|молоко|I drink milk every morning.|Bevo il latte ogni mattina.|Я пью молоко каждое утро.
tea|tiː|чай|Do you want a hot tea?|Vuoi un tè caldo?|Хочешь горячего чаю?
sugar|ˈʃʊɡər|сахар|I don't put sugar in my coffee.|Non metto zucchero nel caffè.|Я не кладу сахар в кофе.
salt|sɔːlt|соль|How much is the salt?|Quanto costa il sale?|Сколько стоит соль?
meat|miːt|мясо|I eat little meat.|Mangio poca carne.|Я мало ем мяса.
fish|fɪʃ|рыба|The fish swims fast.|Il pesce nuota veloce.|Рыба плавает быстро.
cheese|tʃiːz|сыр|This cheese is very good.|Questo formaggio è molto buono.|Этот сыр очень хороший.
rice|raɪs|рис|Rice is a typical dish here.|Il riso è un piatto tipico qui.|Рис — типичное блюдо здесь.
egg|ɛɡ|яйцо|The eggs are in the fridge.|Le uova sono in frigorifero.|Яйца в холодильнике.
fruit|fruːt|фрукты|I eat a lot of fruit in summer.|Mangio tanta frutta in estate.|Летом я ем много фруктов.
apple|ˈæpəl| яблоко|I eat an apple every day.|Mangio una mela ogni giorno.|Я ем яблоко каждый день.
orange|ˈɔːrɪndʒ| апельсин|I drink orange juice.|Bevo un succo d'arancia.|Я пью апельсиновый сок.
foot|fʊt| ступня|My right foot hurts.|Mi fa male il piede destro.|У меня болит правая ступня.
ear|ɪr|ухо|My ear hurts.|Mi fa male l'orecchio.|У меня болит ухо.
nose|noʊz|нос|My nose is red from the cold.|Il mio naso è rosso dal freddo.|Мой нос покраснел от холода.
mouth|maʊθ|рот|Don't talk with your mouth full!|Non parlare con la bocca piena!|Не разговаривай с полным ртом!
tooth|tuːθ|зуб|The child has a new tooth.|Il bambino ha un dente nuovo.|У ребёнка новый зуб.
arm|ɑːrm|рука (от плеча)|My right arm hurts.|Mi fa male il braccio destro.|У меня болит правая рука.
leg|lɛɡ|нога|After running my legs hurt.|Dopo la corsa mi fanno male le gambe.|После бега у меня болят ноги.
heart|hɑːrt|сердце|My heart beats fast.|Il mio cuore batte forte.|Моё сердце сильно бьётся.
hair|hɛr| волосы|I have short hair.|Ho i capelli corti.|У меня короткие волосы.
back|bæk| спина|My back hurts.|Mi fa male la schiena.|У меня болит спина.
finger|ˈfɪŋɡər| палец|I have a ring on my finger.|Ho un anello sul dito.|У меня кольцо на пальце.
room|ruːm|комната|My room is small but bright.|La mia stanza è piccola ma luminosa.|Моя комната маленькая, но светлая.
kitchen|ˈkɪtʃɪn|кухня|The kitchen is my favorite room.|La cucina è la mia stanza preferita.|Кухня — моя любимая комната.
bathroom|ˈbæθruːm|ванная|The bathroom is on the right.|Il bagno è a destra.|Ванная справа.
bed|bɛd|кровать|The cat is sleeping on the bed.|Il gatto dorme sul letto.|Кот спит на кровати.
chair|tʃɛr|стул|This chair is very comfortable.|Questa sedia è molto comoda.|Этот стул очень удобный.
table|ˈteɪbəl|стол|The plates are on the table.|I piatti sono sul tavolo.|Тарелки на столе.
door|dɔːr|дверь|Lock the door.|Chiudi la porta a chiave.|Закрой дверь на ключ.
window|ˈwɪndoʊ|окно|From the window I see the garden.|Dalla finestra vedo il giardino.|Из окна я вижу сад.
key|kiː|ключ|I lost the house keys.|Ho perso le chiavi della casa.|Я потерял ключи от дома.
garden|ˈɡɑːrdən| сад|Your garden is very beautiful.|Il tuo giardino è molto bello.|Твой сад очень красивый.
street|striːt|улица|I live on a quiet street.|Abito in una via tranquilla.|Я живу на тихой улице.
square|skwɛr|площадь|Let's meet in the square at ten.|Ci vediamo in piazza alle dieci.|Встретимся на площади в десять.
bridge|brɪdʒ|мост|The bridge over the river is old.|Il ponte sul fiume è vecchio.|Мост через реку старый.
station|ˈsteɪʃən| вокзал|The station is near the center.|La stazione è vicino al centro.|Вокзал рядом с центром.
airport|ˈɛrpɔːrt|аэропорт|The airport is far from the city.|L'aeroporto è lontano dalla città.|Аэропорт далеко от города.
plane|pleɪn|самолёт|The plane takes off at nine.|L'aereo decolla alle nove.|Самолёт взлетает в девять.
train|treɪn|поезд|The train to Rome is late.|Il treno per Roma è in ritardo.|Поезд на Рим опаздывает.
bus|bʌs|автобус|I take the bus every day.|Prendo l'autobus ogni giorno.|Я каждый день езжу на автобусе.
car|kɑːr|машина|His car is new.|La sua macchina è nuova.|Его машина новая.
bicycle|ˈbaɪsɪkəl|велосипед|I go to work by bike.|Vado al lavoro in bicicletta.|Я еду на работу на велосипеде.
ticket|ˈtɪkɪt|билет|Two tickets to Milan, please.|Due biglietti per Milano, per favore.|Два билета до Милана, пожалуйста.
suitcase|ˈsuːtkeɪs|чемодан|My suitcase is very heavy.|La mia valigia è molto pesante.|Мой чемодан очень тяжёлый.
journey|ˈdʒɜːrni|путешествие|The trip takes three hours.|Il viaggio dura tre ore.|Поездка длится три часа.
hotel|hoʊˈtɛl| отель|The hotel is near the station.|L'albergo è vicino alla stazione.|Отель рядом с вокзалом.
sea|siː|море|In August we go to the sea.|In agosto andiamo al mare.|В августе мы едем на море.
beach|biːtʃ|пляж|The beach is full of people.|La spiaggia è piena di gente.|Пляж полон людей.
mountain|ˈmaʊntɪn| гора|In winter I go to the mountains.|In inverno vado in montagna.|Зимой я езжу в горы.
lake|leɪk|озеро|The lake is very deep.|Il lago è molto profondo.|Озеро очень глубокое.
river|ˈrɪvər|река|The river flows through the city.|Il fiume passa in mezzo alla città.|Река течёт через город.
sun|sʌn|солнце|Today the sun is strong.|Oggi il sole è forte.|Сегодня солнце сильное.
moon|muːn|луна|Tonight the moon is very beautiful.|Stanotte la luna è bellissima.|Сегодня ночью луна очень красивая.
star|stɑːr|звезда|At night I see many stars.|Di notte vedo tante stelle.|Ночью я вижу много звёзд.
sky|skaɪ|небо|The sky is blue today.|Il cielo oggi è azzurro.|Небо сегодня голубое.
rain|reɪn|дождь|I hate rain in the city.|Odio la pioggia in città.|Ненавижу дождь в городе.
snow|snoʊ|снег|Snow is coming to the mountains tomorrow.|Domani arriva la neve in montagna.|Завтра в горы придёт снег.
wind|wɪnd|ветер|The wind blows hard today.|Il vento soffia forte oggi.|Сегодня ветер дует сильно.
pen|pɛn|ручка|Can you lend me a pen, please?|Mi presti una penna, per favore?|Дашь мне ручку, пожалуйста?
page|peɪdʒ|страница|I read ten pages every evening.|Leggo dieci pagine ogni sera.|Я читаю десять страниц каждый вечер.
story|ˈstɔːri|история|Roman history is very interesting.|La storia romana è molto interessante.|Римская история очень интересная.
music|ˈmjuːzɪk|музыка|I listen to music while I work.|Ascolto musica mentre lavoro.|Я слушаю музыку, когда работаю.
film|fɪlm|фильм|The film starts at nine.|Il film inizia alle nove.|Фильм начинается в девять.
song|sɔːŋ|песня|This song is very famous.|Questa canzone è molto famosa.|Эта песня очень известная.
game|ɡeɪm|игра|This game is easy.|Questo gioco è facile.|Эта игра лёгкая.
party|ˈpɑːrti| вечеринка|We are having fun at the party.|Ci divertiamo alla festa.|Мы веселимся на вечеринке.
student|ˈstuːdənt|студент|The student studies a lot for the exam.|Lo studente studia molto per l'esame.|Студент много занимается перед экзаменом.
teacher|ˈtiːtʃər| учитель|The teacher explains the lesson.|L'insegnante spiega la lezione.|Учитель объясняет урок.
lesson|ˈlɛsən|урок|The lesson lasts an hour.|La lezione dura un'ora.|Урок длится час.
university|ˌjuːnɪˈvɜːrsəti|университет|My son studies at the university.|Mio figlio studia all'università.|Мой сын учится в университете.
exam|ɪɡˈzæm|экзамен|The exam is very difficult.|L'esame è molto difficile.|Экзамен очень трудный.
office|ˈɔːfɪs| приёмная, секретариат|My office is on the third floor.|Il mio ufficio è al terzo piano.|Мой офис на третьем этаже.
boss|bɔːs|начальник|My boss is very kind.|Il mio capo è molto gentile.|Мой начальник очень добрый.
colleague|ˈkɑːliːɡ|коллега|My colleagues are nice.|I miei colleghi sono simpatici.|Мои коллеги приятные.
doctor|ˈdɑːktər|врач|I have to go to the doctor.|Devo andare dal dottore.|Мне надо пойти к врачу.
hospital|ˈhɑːspɪtəl|больница|The hospital is near the station.|L'ospedale è vicino alla stazione.|Больница рядом с вокзалом.
medicine|ˈmɛdsɪn|лекарство|I take the medicine three times a day.|Prendo la medicina tre volte al giorno.|Я принимаю лекарство три раза в день.
health|hɛlθ|здоровье|Health is the most important thing.|La salute è la cosa più importante.|Здоровье — самое важное.
pharmacy|ˈfɑːrməsi|аптека|The pharmacy closes at eight.|La farmacia chiude alle otto.|Аптека закрывается в восемь.
price|praɪs|цена|The price is too high.|Il prezzo è troppo alto.|Цена слишком высокая.
shop|ʃɑːp|магазин|The shop opens at nine.|Il negozio apre alle nove.|Магазин открывается в девять.
market|ˈmɑːrkɪt|рынок|I buy fruit at the market.|Compro la frutta al mercato.|Я покупаю фрукты на рынке.
bank|bæŋk|банк|I work in a bank.|Lavoro in una banca.|Я работаю в банке.
account|əˈkaʊnt|счёт|I open an account at the bank.|Apro un conto in banca.|Я открываю счёт в банке.
idea|aɪˈdiːə|идея|I have a good idea!|Ho una buona idea!|У меня есть хорошая идея!
answer|ˈænsər|ответ|Your answer is correct.|La tua risposta è corretta.|Твой ответ правильный.
question|ˈkwɛstʃən|вопрос|I have a question for you.|Ho una domanda per te.|У меня к тебе вопрос.
reason|ˈriːzən| правота, разум|What is the reason for your trip?|Qual è il motivo del tuo viaggio?|Какая причина твоей поездки?
end|ɛnd|конец|The film is good until the end.|Il film è bello fino alla fine.|Фильм хорош до самого конца.
beginning|bɪˈɡɪnɪŋ|начало|The beginning of the book is boring.|L'inizio del libro è noioso.|Начало книги скучное.
beautiful|ˈbjuːtɪfəl|красивый|She has a beautiful voice.|Ha una voce bellissima.|У неё красивый голос.
ugly|ˈʌɡli|некрасивый|That building is ugly.|Quell'edificio è brutto.|То здание некрасивое.
big|bɪɡ|большой|Milan is a big city.|Milano è una città grande.|Милан — большой город.
small|smɔːl|маленький|I live in a small apartment.|Abito in un appartamento piccolo.|Я живу в маленькой квартире.
tall|tɔːl|высокий|My brother is very tall.|Mio fratello è molto alto.|Мой брат очень высокий.
short|ʃɔːrt| короткий|The trousers are too short.|I pantaloni sono troppo corti.|Брюки слишком короткие.
long|lɔːŋ|длинный|The river is three hundred kilometers long.|Il fiume è lungo trecento chilometri.|Река длиной триста километров.
old|oʊld|старый|This book is very old.|Questo libro è molto vecchio.|Эта книга очень старая.
young|jʌŋ|молодой|My aunt is still young.|Mia zia è ancora giovane.|Моя тётя ещё молодая.
easy|ˈiːzi| лёгкий|This exercise is easy.|Questo esercizio è facile.|Это упражнение лёгкое.
difficult|ˈdɪfɪkəlt|трудный|Italian grammar is difficult.|La grammatica italiana è difficile.|Итальянская грамматика трудная.
fast|fæst|быстрый|The train is very fast.|Il treno è molto veloce.|Поезд очень быстрый.
slow|sloʊ|медленный|The internet is slow today.|Internet oggi è lento.|Интернет сегодня медленный.
strong|strɔːŋ|сильный|Italian coffee is very strong.|Il caffè italiano è molto forte.|Итальянский кофе очень крепкий.
weak|wiːk|слабый|The tea is too weak.|Il tè è troppo debole.|Чай слишком слабый.
full|fʊl|полный|The bus is full of people.|L'autobus è pieno di gente.|Автобус полон людей.
empty|ˈɛmpti|пустой|The fridge is empty.|Il frigorifero è vuoto.|Холодильник пустой.
expensive|ɪkˈspɛnsɪv|дорогой|This restaurant is too expensive.|Questo ristorante è troppo caro.|Этот ресторан слишком дорогой.
cheap|tʃiːp|дешёвый|This phone is cheap.|Questo telefono è economico.|Этот телефон дешёвый.
rich|rɪtʃ|богатый|He is a rich and famous man.|È un uomo ricco e famoso.|Он богатый и знаменитый человек.
poor|pʊr|бедный|This man is poor but happy.|Questo signore è povero ma felice.|Этот человек бедный, но счастливый.
important|ɪmˈpɔːrtənt|важный|It is an important meeting.|È una riunione importante.|Это важная встреча.
interesting|ˈɪntrəstɪŋ|интересный|Your job seems interesting.|Il tuo lavoro sembra interessante.|Твоя работа кажется интересной.
boring|ˈbɔːrɪŋ|скучный|The meeting was very boring.|La riunione era molto noiosa.|Совещание было очень скучным.
clean|kliːn|чистый|My room is always clean.|La mia stanza è sempre pulita.|Моя комната всегда чистая.
dirty|ˈdɜːrti|грязный|Your shoes are dirty.|Le tue scarpe sono sporche.|Твои ботинки грязные.
happy|ˈhæpi|счастливый|I am happy to see you!|Sono felice di vederti!|Я счастлив тебя видеть!
sad|sæd|грустный|The film is good but sad.|Il film è bello ma triste.|Фильм хороший, но грустный.
tired|ˈtaɪərd|уставший|I am tired, I am going to sleep.|Sono stanco, vado a dormire.|Я устал, иду спать.
hungry|ˈhʌŋɡri|голодный|I am hungry, shall we eat?|Sono affamato, mangiamo?|Я голодный, поедим?
thirsty|ˈθɜːrsti|жаждущий|I am thirsty, I'll drink a glass of water.|Sono assetato, bevo un bicchiere d'acqua.|Я хочу пить, выпью стакан воды.
ready|ˈrɛdi|готовый|Dinner is ready!|La cena è pronta!|Ужин готов!
last|læst|последний|The last bus leaves at midnight.|L'ultimo autobus parte a mezzanotte.|Последний автобус уходит в полночь.
first|fɜːrst|первый|The first day of the week is Monday.|Il primo giorno della settimana è lunedì.|Первый день недели — понедельник.
near|nɪr| близко|The supermarket is near my house.|Il supermercato è vicino a casa mia.|Супермаркет рядом с моим домом.
far|fɑːr| далеко|Is the center far from here?|Il centro è lontano da qui?|Центр далеко отсюда?
together|təˈɡɛðər|вместе|Let's go to the cinema together.|Andiamo al cinema insieme.|Пойдём в кино вместе.
really|ˈriːəli|действительно|It is really a good film.|È davvero un buon film.|Это действительно хороший фильм.
already|ɔːlˈrɛdi|уже|I have already finished my homework.|Ho già finito i compiti.|Я уже закончил домашнюю работу.
almost|ˈɔːlmoʊst|почти|I am almost ready.|Sono quasi pronto.|Я почти готов.
then|ðɛn| тогда|First I eat, then I study.|Prima mangio, poi studio.|Сначала я ем, потом учусь.
after|ˈæftər| после|After work I go home.|Dopo il lavoro vado a casa.|После работы я иду домой.
before|bɪˈfɔːr| до|Before eating I wash my hands.|Prima di mangiare mi lavo le mani.|Перед едой я мою руки.
inside|ɪnˈsaɪd|внутри|The documents are inside the bag.|I documenti sono dentro la borsa.|Документы внутри сумки.
outside|ˌaʊtˈsaɪd|снаружи|It is raining outside.|Fuori piove.|На улице идёт дождь.
  `;

// расширение частотного списка до 1000 слов (только для набора «1000 самых частотных слов»)
const CORE_EXT = `
four|fɔːr|четыре|I have four sisters.|Ho quattro sorelle.|У меня четыре сестры.
five|faɪv|пять|The train leaves at five.|Il treno parte alle cinque.|Поезд отправляется в пять.
six|sɪks|шесть|It is six o'clock now.|Ora sono le sei.|Сейчас шесть часов.
seven|ˈsɛvən|семь|The lesson starts at seven.|La lezione inizia alle sette.|Урок начинается в семь.
eight|eɪt|восемь|I close the shop at eight.|Chiudo il negozio alle otto.|Я закрываю магазин в восемь.
nine|naɪn|девять|It is nine in the evening.|Sono le nove di sera.|Сейчас девять вечера.
ten|tɛn|десять|The film lasts two hours and ten minutes.|Il film dura due ore e dieci.|Фильм идёт два часа десять минут.
eleven|ɪˈlɛvən|одиннадцать|I have eleven unread messages.|Ho undici messaggi non letti.|У меня одиннадцать непрочитанных сообщений.
twelve|twɛlv|двенадцать|We have lunch at twelve.|A pranzo alle dodici.|Мы обедаем в двенадцать.
thirteen|ˌθɜːrˈtiːn|тринадцать|My number is thirteen.|Il mio numero è il tredici.|Мой номер — тринадцать.
fourteen|ˌfɔːrˈtiːn|четырнадцать|I am fourteen years old.|Ho quattordici anni.|Мне четырнадцать лет.
fifteen|ˌfɪfˈtiːn|пятнадцать|The bus arrives at three p.m.|Il bus arriva alle quindici.|Автобус прибывает в пятнадцать ноль-ноль.
sixteen|ˌsɪkˈstiːn|шестнадцать|The meeting is at four p.m.|La riunione è alle sedici.|Собрание в шестнадцать часов.
seventeen|ˌsɛvənˈtiːn|семнадцать|You pay only seventeen euros.|Paghi solo diciassette euro.|Ты платишь всего семнадцать евро.
eighteen|ˌeɪˈtiːn|восемнадцать|You come of age at eighteen.|È maggiorenne a diciotto anni.|Совершеннолетие наступает в восемнадцать.
nineteen|ˌnaɪnˈtiːn|девятнадцать|My room is number nineteen.|La mia stanza è la diciannove.|Моя комната — девятнадцатая.
twenty|ˈtwɛnti|двадцать|This book costs twenty euros.|Questo libro costa venti euro.|Эта книга стоит двадцать евро.
thirty|ˈθɜːrti|тридцать|Marco is thirty years old.|Marco ha trenta anni.|Марко тридцать лет.
forty|ˈfɔːrti|сорок|The bus runs every forty minutes.|L'autobus passa ogni quaranta minuti.|Автобус ходит каждые сорок минут.
fifty|ˈfɪfti|пятьдесят|I have only fifty euros.|Ho solo cinquanta euro.|У меня всего пятьдесят евро.
sixty|ˈsɪksti|шестьдесят|Grandfather is sixty years old.|Il nonno ha sessanta anni.|Дедушке шестьдесят лет.
seventy|ˈsɛvənti|семьдесят|The speed is seventy per hour.|La velocità è settanta all'ora.|Скорость — семьдесят в час.
eighty|ˈeɪti|восемьдесят|The house is eighty years old.|La casa ha ottanta anni.|Дому восемьдесят лет.
ninety|ˈnaɪnti|девяносто|Ninety students pass the exam.|Novanta studenti passano l'esame.|Девяносто студентов сдают экзамен.
hundred|ˈhʌndrəd|сто|I have a hundred photos on my phone.|Ho cento foto sul telefono.|У меня сто фото на телефоне.
thousand|ˈθaʊzənd|тысяча|This city is a thousand years old.|Questa città ha mille anni.|Этому городу тысяча лет.
million|ˈmɪljən|миллион|A million people visit the museum.|Un milione di persone visitano il museo.|Миллион человек посещают музей.
half|hæf|половина|I have only half a day off.|Ho solo mezzo giorno libero.|У меня всего полдня выходного.
double|ˈdʌbəl| двойной|I would like a double coffee.|Vorrei un caffè doppio.|Я хотел бы двойной кофе.
third|θɜːrd|третий|I live on the third floor.|Vivo al terzo piano.|Я живу на третьем этаже.
Monday|ˈmʌndeɪ|понедельник|On Monday I go back to work.|Lunedì torno al lavoro.|В понедельник я возвращаюсь на работу.
Tuesday|ˈtuːzdeɪ|вторник|On Tuesday I have a lesson.|Martedì ho una lezione.|Во вторник у меня урок.
Wednesday|ˈwɛnzwedeɪ|среда|On Wednesday I go to the doctor.|Mercoledì vado dal dottore.|В среду я иду к врачу.
Thursday|ˈθɜːrzdeɪ|четверг|On Thursday I have dinner at Marco's.|Giovedì ceno da Marco.|В четверг я ужинаю у Марко.
Friday|ˈfraɪdeɪ|пятница|On Friday evening we go out together.|Venerdì sera usciamo insieme.|В пятницу вечером мы идём гулять вместе.
Saturday|ˈsætərdeɪ|суббота|On Saturday I play football.|Sabato gioco a calcio.|В субботу я играю в футбол.
Sunday|ˈsʌndeɪ|воскресенье|On Sunday I rest at home.|La domenica riposo a casa.|В воскресенье я отдыхаю дома.
January|ˈdʒænjuɛri|январь|The course starts in January.|Il corso inizia a gennaio.|Курс начинается в январе.
February|ˈfɛbrueɪri|февраль|In February it often rains.|A febbraio piove spesso.|В феврале часто идёт дождь.
March|mɑːrtʃ|март|In March the trees blossom.|A marzo fioriscono gli alberi.|В марте цветут деревья.
April|ˈeɪprəl|апрель|My birthday is in April.|Il mio compleanno è ad aprile.|Мой день рождения в апреле.
May|meɪ|май|In May I go to the sea.|A maggio vado al mare.|В мае я еду на море.
June|dʒuːn|июнь|June is a warm month.|Giugno è un mese caldo.|Июнь — тёплый месяц.
July|dʒuˈlaɪ|июль|In July I am on holiday.|A luglio sono in vacanza.|В июле я в отпуске.
August|ˈɔːɡəst|август|August is the month of holidays.|Agosto è il mese delle vacanze.|Август — месяц отпусков.
September|sɛpˈtɛmbər|сентябрь|In September I go back to school.|A settembre torno a scuola.|В сентябре я возвращаюсь в школу.
October|ɒkˈtoʊbər|октябрь|In October the leaves fall.|A ottobre le foglie cadono.|В октябре падают листья.
November|noʊˈvɛmbər|ноябрь|November is a rainy month.|Novembre è un mese piovoso.|Ноябрь — дождливый месяц.
December|diˈsɛmbər|декабрь|In December I prepare presents.|A dicembre preparo i regali.|В декабре я готовлю подарки.
spring|sprɪŋ|весна|In spring it is warmer.|In primavera fa più caldo.|Весной теплее.
summer|ˈsʌmər|лето|Summer is my favourite season.|L'estate è la mia stagione preferita.|Лето — моё любимое время года.
autumn|ˈɔːtəm|осень|In autumn I read many books.|In autunno leggo molti libri.|Осенью я читаю много книг.
winter|ˈwɪntər|зима|In winter it snows in the mountains.|In inverno nevica in montagna.|Зимой в горах идёт снег.
red|rɛd|красный|I bought a red T-shirt.|Ho comprato una maglia rossa.|Я купил красную футболку.
blue|bluː|синий, голубой|The sea is blue today.|Il mare è blu oggi.|Море сегодня синее.
green|ɡriːn|зелёный|The traffic light is green.|Il semaforo è verde.|Светофор зелёный.
yellow|ˈjɛloʊ|жёлтый|My car is yellow.|La mia macchina è gialla.|Моя машина жёлтая.
black|blæk|чёрный|The cat is black.|Il gatto è nero.|Кот чёрный.
white|waɪt|белый|White wine is cool.|Il vino bianco è fresco.|Белое вино прохладное.
pink|pɪŋk|розовый|Her room is pink.|La sua stanza è rosa.|Её комната розовая.
grey|ɡreɪ|серый|The grey cat is sleeping.|Il gatto grigio dorme.|Серый кот спит.
brown|braʊn|коричневый|The dog is brown.|Il cane è marrone.|Собака коричневая.
purple|ˈpɜːrpəl|фиолетовый|Her dress is purple.|Il suo vestito è viola.|Её платье фиолетовое.
light|laɪt| свет|The light of the sun is strong.|La luce del sole è forte.|Солнечный свет сильный.
dark|dɑːrk|тёмный|The room is too dark.|La stanza è troppo scura.|Комната слишком тёмная.
colour|ˈkʌlər| цвет|The colours of the house are warm.|I colori della casa sono caldi.|Цвета дома тёплые.
grandfather|ˈɡrænfɑːðər|дедушка|Grandfather tells a story.|Il nonno racconta una storia.|Дедушка рассказывает историю.
grandmother|ˈɡrænmʌðər|бабушка|Grandmother makes the cake.|La nonna prepara la torta.|Бабушка готовит торт.
uncle|ˈʌŋkəl|дядя|My uncle lives in Rome.|Mio zio abita a Roma.|Мой дядя живёт в Риме.
aunt|ænt|тётя|My aunt speaks English.|Mia zia parla inglese.|Моя тётя говорит по-английски.
cousin|ˈkʌzən| двоюродная сестра|My cousin studies medicine.|Il mio cugino studia medicina.|Мой двоюродный брат учится на врача.
nephew|ˈnɛfjuː|племянник, внук|The grandson plays in the garden.|Il nipote gioca in giardino.|Внук играет в саду.
parents|ˈpɛrənts|родители|My parents are at home.|I miei genitori sono a casa.|Мои родители дома.
guest|ɡɛst|гость|We have a guest for dinner.|Abbiamo un ospite a cena.|У нас гость на ужин.
neighbour|ˈneɪbər| сосед|The neighbours are kind.|I vicini di casa sono gentili.|Соседи добрые.
shoulder|ˈʃoʊldər|плечо|My shoulder hurts.|La mia spalla fa male.|У меня болит плечо.
knee|niː|колено|The child cut his knee.|Il bambino si è tagliato il ginocchio.|Ребёнок порезал колено.
thumb|θʌm|большой палец|The thumb is the strongest finger.|Il pollice è il dito più forte.|Большой палец — самый сильный палец.
neck|nɛk|шея|My neck hurts today.|Il collo mi fa male oggi.|Шея сегодня болит.
skin|skɪn|кожа|Her skin is very fair.|La sua pelle è molto chiara.|У неё очень светлая кожа.
lips|lɪps|губы|Her lips are red.|Le sue labbra sono rosse.|Её губы красные.
tongue|tʌŋ| язык (орган)|Italian is a beautiful language.|L'italiano è una bella lingua.|Итальянский — красивый язык.
stomach|ˈstʌmək|живот, желудок|My stomach is rumbling.|Il mio stomaco brontola.|Мой живот урчит.
cheek|tʃiːk|щёка|The child has pink cheeks.|Il bambino ha le guance rosa.|У ребёнка розовые щёки.
shirt|ʃɜːrt|рубашка|My shirt is white.|La mia camicia è bianca.|Моя рубашка белая.
T-shirt|ˈtiːʃɜːrt|футболка|I am wearing a green T-shirt.|Indosso una maglietta verde.|На мне зелёная футболка.
trousers|ˈtraʊzərz|брюки|These trousers are comfortable.|Questi pantaloni sono comodi.|Эти брюки удобные.
skirt|skɜːrt|юбка|My sister has a new skirt.|Mia sorella ha una gonna nuova.|У моей сестры новая юбка.
dress|drɛs| платье|I am wearing an elegant dress.|Indosso un vestito elegante.|Я одет(а) в элегантное платье.
shoe|ʃuː|ботинок, туфля|These shoes are new.|Queste scarpe sono nuove.|Эти туфли новые.
boot|buːt|сапог|In winter I wear boots.|In inverno indosso gli stivali.|Зимой я ношу сапоги.
coat|koʊt|пальто, шуба|The coat is on the bed.|Il cappotto è sul letto.|Пальто на кровати.
jacket|ˈdʒækɪt|пиджак, куртка|The jacket is in the wardrobe.|La giacca è nel guardaroba.|Пиджак в шкафу.
sweater|ˈswɛtər|свитер|This sweater is very warm.|Questo maglione è molto caldo.|Этот свитер очень тёплый.
hat|hæt|шляпа, шапка|I put on my hat.|Mi metto il cappello.|Я надеваю шляпу.
scarf|skɑːrf|шарф|The scarf is made of wool.|La sciarpa è di lana.|Шарф из шерсти.
gloves|ɡlʌvz| перчатки|In winter I wear gloves.|In inverno porto i guanti.|Зимой я ношу перчатки.
belt|bɛlt|ремень, пояс|The belt is in the pocket.|La cintura è nella tasca.|Ремень в кармане.
sock|sɑːk| носок|I have lost a sock.|Ho perso una calza.|Я потерял носок.
button|ˈbʌtən|пуговица|A button fell off the shirt.|Un bottone è caduto dalla camicia.|Пуговица оторвалась от рубашки.
pocket|ˈpɑːkɪt|карман|The keys are in the pocket.|Le chiavi sono in tasca.|Ключи в кармане.
oil|ɔɪl|масло|I add oil to the salad.|Aggiungo olio all'insalata.|Я добавляю масло в салат.
vinegar|ˈvɪnɪɡər|уксус|Vinegar and oil for the salad.|Aceto e olio per l'insalata.|Уксус и масло для салата.
pepper|ˈpɛpər|перец|The pepper is too spicy.|Il pepe è troppo piccante.|Перец слишком острый.
soup|suːp| суп|The soup is hot.|La zuppa è calda.|Суп горячий.
salad|ˈsæləd|салат|I make a fresh salad.|Preparo un'insalata fresca.|Я готовлю свежий салат.
dessert|diˈzɜːrt| десерт|For dessert I have ice cream.|Come dolce prendo il gelato.|На десерт я беру мороженое.
ice cream|ˌaɪs ˈkriːm|мороженое|A vanilla ice cream, please.|Un gelato alla vaniglia, per cortesia.|Мороженое с ванилью, пожалуйста.
cake|keɪk|торт, пирог|The birthday cake is ready.|La torta di compleanno è pronta.|Торт ко дню рождения готов.
biscuit|ˈbɪskɪt|печенье|A biscuit with tea.|Un biscotto con il tè.|Печенье к чаю.
chocolate|ˈtʃɔːklət|шоколад|Dark chocolate is bitter.|Il cioccolato fondente è amaro.|Тёмный шоколад горький.
honey|ˈhʌni|мёд|Tea with honey is good.|Il tè con il miele è buono.|Чай с мёдом вкусный.
flour|ˈflaʊər|мука|The cake needs flour.|Per la torta serve la farina.|Для торта нужна мука.
ham|hæm|ветчина|A sandwich with ham.|Un panino con il prosciutto.|Бутерброд с ветчиной.
tomato|təˈmeɪtoʊ|помидор|Salad with fresh tomatoes.|Insalata con pomodori freschi.|Салат со свежими помидорами.
potato|pəˈteɪtoʊ|картофель|The boiled potatoes are ready.|Le patate lesse sono pronte.|Варёный картофель готов.
carrot|ˈkærət|морковь|Carrots are good for the eyesight.|Le carote sono buone per la vista.|Морковь полезна для зрения.
onion|ˈʌnjən|лук|Onion makes you cry.|La cipolla fa piangere.|От лука плачут.
garlic|ˈɡɑːrlɪk|чеснок|I add garlic to the pasta.|Aggiungo aglio alla pasta.|Я добавляю чеснок в пасту.
lemon|ˈlɛmən|лимон|Tea with lemon.|Il tè con il limone.|Чай с лимоном.
pear|pɛr|груша|The pear is sweet.|La pera è dolce.|Груша сладкая.
banana|bəˈnænə|банан|I eat a banana after the run.|Mangio una banana dopo la corsa.|Я ем банан после пробежки.
strawberry|ˈstrɔːbɛri|земляника, клубника|The strawberries are with cream.|Le fragole sono con la panna.|Клубника со сливками.
grape|ɡreɪp|виноград|The grapes are ripe.|L'uva è matura.|Виноград спелый.
plate|pleɪt|тарелка; блюдо|The plate is on the table.|Il piatto è sul tavolo.|Тарелка на столе.
glass|ɡlæs|стакан, бокал|A glass of water, thanks.|Un bicchiere d'acqua, grazie.|Стакан воды, спасибо.
cup|kʌp|чашка|A cup of hot tea.|Una tazza di tè caldo.|Чашка горячего чая.
bottle|ˈbɒtəl|бутылка|I buy a bottle of water.|Compro una bottiglia d'acqua.|Я покупаю бутылку воды.
knife|naɪf|нож|The knife cuts well.|Il coltello taglia bene.|Нож режет хорошо.
fork|fɔːrk|вилка|Two forks are needed.|Servono due forchette.|Нужны две вилки.
spoon|spuːn|ложка|The spoon is in the cup.|Il cucchiaio è nella tazza.|Ложка в чашке.
lunch|lʌntʃ|обед|Lunch is ready at twelve.|Il pranzo è pronto alle dodici.|Обед готов в двенадцать.
breakfast|ˈbrɛkfəst|завтрак|Breakfast is at eight.|La colazione è alle otto.|Завтрак в восемь.
dinner|ˈdɪnər|ужин|Dinner is at eight p.m.|La cena è alle otto di sera.|Ужин в восемь вечера.
juice|dʒuːs|сок|A fresh orange juice.|Un succo d'arancia fresco.|Свежий апельсиновый сок.
restaurant|ˈrɛstrənt|ресторан|The restaurant is full tonight.|Il ristorante è pieno stasera.|Ресторан полон сегодня вечером.
bar|bɑːr|бар, кафе|I will meet you at the bar.|Ti incontro al bar.|Встречу тебя в кафе.
church|tʃɜːrtʃ|церковь|The church is very old.|La chiesa è molto antica.|Церковь очень старая.
museum|mjuˈziːəm|музей|The museum is closed on Mondays.|Il museo è chiuso il lunedì.|Музей закрыт по понедельникам.
theatre|ˈθɪətər|театр|We are going to the theatre tonight.|Andiamo al teatro stasera.|Мы идём в театр сегодня вечером.
cinema|ˈsɪnəma|кинотеатр|I go to the cinema with friends.|Vado al cinema con gli amici.|Я иду в кино с друзьями.
park|pɑːrk| парковаться|The children play in the park.|I bambini giocano al parco.|Дети играют в парке.
library|ˈlaɪbrɛri|библиотека|I study in the library every day.|Studio in biblioteca ogni giorno.|Я учусь в библиотеке каждый день.
swimming pool|ˈswɪmɪŋ puːl|бассейн|The swimming pool is open today.|La piscina è aperta oggi.|Бассейн открыт сегодня.
gym|dʒɪm|спортивный зал|I go to the gym after work.|Vado in palestra dopo il lavoro.|Я хожу в спортзал после работы.
stadium|ˈsteɪdiəm|стадион|The stadium is full of people.|Lo stadio è pieno di gente.|Стадион полон людей.
factory|ˈfæktəri|фабрика, завод|He works in a car factory.|Lavora in una fabbrica di automobili.|Он работает на автомобильном заводе.
centre|ˈsɛntər|центр|The city centre is crowded.|Il centro città è affollato.|Центр города людный.
countryside|ˈkʌntrisaɪd|сельская местность|The countryside is beautiful in spring.|La campagna è bella in primavera.|Сельская местность прекрасна весной.
balcony|ˈbælkəni|балкон|The cat sleeps on the balcony.|Il gatto dorme sul balcone.|Кот спит на балконе.
stairs|stɛərz|лестница|The stairs are at the end of the corridor.|Le scale sono in fondo al corridoio.|Лестница в конце коридора.
lift|lɪft|лифт|The lift is broken again.|L'ascensore è rotto di nuovo.|Лифт снова сломан.
corridor|ˈkɔːridɔːr|коридор|The corridor is long.|Il corridoio è lungo.|Коридор длинный.
ceiling|ˈsiːlɪŋ|потолок|The ceiling is high.|Il soffitto è alto.|Потолок высокий.
floor|flɔːr| пол; этаж|The floor is cold.|Il pavimento è freddo.|Пол холодный.
roof|ruːf|крыша|From the roof you can see the sea.|Dal tetto si vede il mare.|С крыши видно море.
wall|wɔːl|стена|A picture on the wall.|Un quadro sul muro.|Картина на стене.
building|ˈbɪldɪŋ|дом, здание|This building is historic.|Questo palazzo è storico.|Это здание историческое.
motorbike|ˈmoʊtərbaɪk|мотоцикл|The boy has a new motorbike.|Il ragazzo ha una moto nuova.|У парня новый мотоцикл.
taxi|ˈtæksi|такси|I take a taxi to the airport.|Prendo un tassì per l'aeroporto.|Я беру такси в аэропорт.
tram|træm|трамвай|The tram runs every ten minutes.|Il tram passa ogni dieci minuti.|Трамвай ходит каждые десять минут.
underground|ˈʌndərɡraʊnd|метро|The underground is fast.|La metropolitana è veloce.|Метро быстрое.
ship|ʃɪp|корабль|The ship leaves from the port.|La nave parte dal porto.|Корабль отходит из порта.
port|pɔːrt|порт, гавань|The port is full of ships.|Il porto è pieno di navi.|Порт полон кораблей.
flight|flaɪt|рейс, полёт|The flight is delayed.|Il volo è in ritardo.|Рейс задерживается.
passenger|ˈpæsəndʒər|пассажир|The passenger has a suitcase.|Il passeggero ha una valigia.|У пассажира чемодан.
pilot|ˈpaɪlət|пилот|The pilot talks to the passengers.|Il pilota parla ai passeggeri.|Пилот разговаривает с пассажирами.
platform|ˈplætfɔːrm| платформа|The train leaves from platform seven.|Il treno parte dal binario sette.|Поезд отходит с седьмой платформы.
timetable|ˈtaɪmtəbəl| расписание|I look at the train timetable.|Guardo l'orario dei treni.|Я смотрю расписание поездов.
petrol|ˈpɛtrəl|бензин|The journey needs petrol.|Serve benzina per il viaggio.|Для поездки нужен бензин.
corner|ˈkɔːrnər| угол; поворот|The bar is on the corner.|Il bar è all'angolo.|Бар на углу.
traffic|ˈtræfɪk|движение, пробки|There is a lot of traffic this morning.|C'è molto traffico stamattina.|Сегодня утром большие пробки.
car park|ˈkɑːr pɑːrk|парковка|The car park is full.|Il parcheggio è pieno.|Парковка полная.
monument|ˈmɒnjumənt|памятник|The monument is in the middle of the square.|Il monumento è al centro della piazza.|Памятник в центре площади.
fountain|ˈfaʊntən|фонтан|We sit near the fountain.|Ci sediamo vicino alla fontana.|Мы садимся у фонтана.
tower|ˈtaʊər|башня|The tower is very tall.|La torre è molto alta.|Башня очень высокая.
dog|dɒɡ|собака|The dog plays in the garden.|Il cane gioca nel giardino.|Собака играет в саду.
cat|kæt|кот, кошка|The cat sleeps on the sofa.|Il gatto dorme sul divano.|Кот спит на диване.
horse|hɔːrs|конь, лошадь|The horse runs in the field.|Il cavallo corre nel campo.|Конь бежит в поле.
cow|kaʊ|корова|The cows are in the meadow.|Le mucche sono nel prato.|Коровы на лугу.
bird|bɜːrd|птица|A bird sings at the window.|Un uccello canta alla finestra.|Птица поёт у окна.
butterfly|ˈbʌtərflaɪ|бабочка (насекомое)|A butterfly flies in the garden.|Una farfalla vola nel giardino.|Бабочка летает в саду.
bee|biː|пчела|Bees make honey.|Le api fanno il miele.|Пчёлы делают мёд.
tree|triː|дерево|The tree is very old.|L'albero è molto vecchio.|Дерево очень старое.
flower|ˈflaʊər|цветок|I bought flowers for her.|Ho comprato dei fiori per lei.|Я купил ей цветы.
leaf|liːf|лист (растения)|The leaf is green in summer.|La foglia è verde d'estate.|Лист летом зелёный.
forest|ˈfɒrɪst| лес|The forest is full of birds.|La foresta è piena di uccelli.|Лес полон птиц.
hill|hɪl|холм|The house is on a hill.|La casa è su una collina.|Дом на холме.
valley|ˈvæli|долина|The valley is green and quiet.|La valle è verde e tranquilla.|Долина зелёная и тихая.
sand|sænd|песок|The sand is warm in the sun.|La sabbia è calda al sole.|Песок тёплый на солнце.
stone|stoʊn| камень|The old wall is made of stone.|Il vecchio muro è di pietra.|Старая стена из камня.
ground|ɡraʊnd| земля; почва|The ground is dry in summer.|La terra è secca d'estate.|Земля летом сухая.
fire|ˈfaɪər|огонь|The fire in the stove is warm.|Il fuoco nella stufa è caldo.|Огонь в печи тёплый.
air|ɛər|воздух|The mountain air is clean.|L'aria di montagna è pulita.|Горный воздух чистый.
fog|fɒɡ|туман|The fog covers the city.|La nebbia copre la città.|Туман покрывает город.
ice|aɪs|лёд|The lake is covered with ice.|Il lago è coperto di ghiaccio.|Озеро покрыто льдом.
minute|ˈmɪnɪt|минута|Wait a minute, please.|Aspetta un minuto, per favore.|Подожди минуту, пожалуйста.
clock|klɒk|часы (настенные)|My watch is fast.|Il mio orologio va avanti.|Мои часы спешат.
nurse|nɜːrs|медсестра, медбрат|The nurse works at night.|L'infermiere lavora di notte.|Медбрат работает ночью.
lawyer|ˈlɔːjər|адвокат|The lawyer reads the document.|L'avvocato legge il documento.|Адвокат читает документ.
engineer|ˌɛndʒɪˈnɪər|инженер|My father is an engineer.|Mio padre è ingegnere.|Мой отец инженер.
cook|kʊk| повар; готовить|The cook makes dinner.|Il cuoco prepara la cena.|Повар готовит ужин.
waiter|ˈweɪtər|официант|The waiter brings the bill.|Il cameriere porta il conto.|Официант приносит счёт.
mechanic|miˈkænɪk|механик|The mechanic repairs the car.|Il meccanico ripara la macchina.|Механик чинит машину.
artist|ˈɑːrtɪst|художник; артист|The artist paints a picture.|L'artista dipinge un quadro.|Художник пишет картину.
writer|ˈraɪtər|писатель|The writer writes a new book.|Lo scrittore scrive un libro nuovo.|Писатель пишет новую книгу.
singer|ˈsɪŋər|певец, певица|The singer has a beautiful voice.|Il cantante ha una bella voce.|У певца красивый голос.
actor|ˈæktər|актёр|The actor is in the new film.|L'attore è nel film nuovo.|Актёр в новом фильме.
policeman|pəˈliːsmən|полицейский|The policeman helps people.|Il poliziotto aiuta le persone.|Полицейский помогает людям.
postman|ˈpoʊstmən|почтальон|The postman brings the letters.|Il postino porta le lettere.|Почтальон приносит письма.
telephone|ˈtɛlɪfoʊn|телефон|My phone is out of battery.|Il mio telefono è scarico.|Мой телефон разряжен.
mobile phone|ˈmoʊbaɪl foʊn|мобильный телефон|Your mobile phone is ringing.|Il tuo cellulare suona.|Твой мобильный звонит.
computer|kəmˈpjuːtər|компьютер|I work at the computer all day.|Lavoro al computer tutto il giorno.|Я работаю за компьютером весь день.
television|ˈtɛlɪvɪʒən|телевизор|The television is in the living room.|Il televisore è nel salotto.|Телевизор в гостиной.
radio|ˈreɪdioʊ|радио|I listen to the radio in the car.|Ascolto la radio in macchina.|Я слушаю радио в машине.
message|ˈmɛsɪdʒ|сообщение|I have received a message from you.|Ho ricevuto un tuo messaggio.|Я получил от тебя сообщение.
email|ˈiːmeɪl|электронное письмо|I will send you an email tonight.|Ti mando un'email stasera.|Я отправлю тебе письмо сегодня вечером.
letter|ˈlɛtər|письмо|I write a letter to grandmother.|Scrivo una lettera alla nonna.|Я пишу письмо бабушке.
parcel|ˈpɑːrsəl|посылка, пакет|The parcel arrived this morning.|Il pacco è arrivato stamattina.|Посылка пришла сегодня утром.
address|əˈdrɛs|адрес|Write me your address.|Scrivimi il tuo indirizzo.|Напиши мне свой адрес.
document|ˈdɒkjumənt|документ|The document is in the bag.|Il documento è nella borsa.|Документ в сумке.
passport|ˈpɑːspɔːrt|паспорт|The passport is valid for ten years.|Il passaporto è valido dieci anni.|Паспорт действителен десять лет.
photograph|ˈfoʊtəɡrɑːf|фотография|A photograph of the grandparents.|Una fotografia dei nonni.|Фотография бабушки и дедушки.
birthday|ˈbɜːrθdeɪ|день рождения|Happy birthday, Marco!|Buon compleanno, Marco!|С днём рождения, Марко!
surprise|sərˈpraɪz|сюрприз|What a nice surprise to see you!|Che bella sorpresa vedere te!|Какой приятный сюрприз — видеть тебя!
wedding|ˈwɛdɪŋ| свадьба|The wedding is in June.|Il matrimonio è a giugno.|Свадьба в июне.
holiday|ˈhɒlədeɪ| отпуск|The holidays start tomorrow.|Le vacanze iniziano domani.|Каникулы начинаются завтра.
rest|rɛst| отдых|Rest is the best cure.|Il riposo è la migliore cura.|Отдых — лучшее лечение.
dream|driːm| сон; мечта|I had a nice dream.|Ho fatto un bel sogno.|Мне приснился хороший сон.
truth|truːθ|правда|The truth is important.|La verità è importante.|Правда важна.
lie|laɪ| ложь; лгать|Don't tell lies.|Non dire bugie.|Не говори лжи.
peace|piːs|мир, покой|The country wants peace.|Il paese vuole la pace.|Страна хочет мира.
war|wɔːr|война|Grandfather tells about the war.|Il nonno racconta la guerra.|Дедушка рассказывает о войне.
luck|lʌk| удача|Good luck at the exam!|Buona fortuna all'esame!|Удачи на экзамене!
problem|ˈprɒbləm|проблема|I have a problem with the computer.|Ho un problema con il computer.|У меня проблема с компьютером.
service|ˈsɜːrvɪs|сервис, услуга|The restaurant service is good.|Il servizio del ristorante è buono.|Сервис в ресторане хороший.
salary|ˈsæləri|зарплата|The salary arrives on the first of the month.|Lo stipendio arriva il primo del mese.|Зарплата приходит первого числа.
meeting|ˈmiːtɪŋ| собрание|The meeting starts at nine.|La riunione inizia alle nove.|Собрание начинается в девять.
project|ˈprɒdʒɛkt|проект|The project is almost finished.|Il progetto è quasi finito.|Проект почти закончен.
order|ˈɔːrdər|порядок; заказ|I placed an order online.|Ho fatto un ordine online.|Я сделал заказ онлайн.
news|njuːz| новость|What good news!|Che bella notizia!|Какая хорошая новость!
magazine|ˌmæɡəˈziːn|журнал|I buy a magazine at the station.|Compro una rivista in stazione.|Я покупаю журнал на вокзале.
envelope|ˈɛnvəloʊp|конверт|The envelope is on the desk.|La busta è sulla scrivania.|Конверт на письменном столе.
desk|dɛsk|письменный стол|The lamp is on the desk.|La lampada è sulla scrivania.|Лампа на письменном столе.
lamp|læmp|лампа|The lamp is on.|La lampada è accesa.|Лампа включена.
battery|ˈbætəri|батарея, аккумулятор|The phone battery is flat.|La batteria del telefono è scarica.|Батарея телефона разряжена.
charger|ˈtʃɑːrdʒər|зарядное устройство|The charger is in the drawer.|Il caricatore è nel cassetto.|Зарядка в ящике.
headphones|ˈhɛdfoʊnz|наушники|The earphones are new.|Gli auricolari sono nuovi.|Наушники новые.
screen|skriːn|экран|The screen is broken.|Lo schermo è rotto.|Экран разбит.
keyboard|ˈkiːbɔːrd|клавиатура|The keyboard is new.|La tastiera è nuova.|Клавиатура новая.
paper|ˈpeɪpər| бумага|A sheet of paper, please.|Un foglio di carta, per favore.|Лист бумаги, пожалуйста.
coins|kɔɪnz|монеты (мн.)|I have only coins.|Ho solo monete.|У меня только монеты.
cash|kæʃ|наличные|I pay in cash.|Pago in contanti.|Я плачу наличными.
discount|ˈdɪskaʊnt|скидка|There is a ten per cent discount.|C'è uno sconto del dieci per cento.|Скидка десять процентов.
invoice|ˈɪnvɔɪs|счёт-фактура|The invoice is in the envelope.|La fattura è nella busta.|Счёт в конверте.
cash machine|ˈkæʃ məʃiːn|банкомат|The cash machine is outside the bank.|Il bancomat è fuori dalla banca.|Банкомат снаружи банка.
credit card|ˈkrɛdɪt kɑːrd|кредитная карта|I pay by credit card.|Pago con la carta di credito.|Я плачу кредитной картой.
savings|ˈseɪvɪŋz| сбережения|Saving is important.|Il risparmio è importante.|Экономия важна.
loan|loʊn|заём, кредит|The bank loan is expensive.|Il prestito della banca è caro.|Кредит в банке дорогой.
interest|ˈɪntərɛst|интерес; процент|I have an interest in music.|Ho interesse per la musica.|Я интересуюсь музыкой.
tailor|ˈteɪlər|портной|The tailor adjusts the trousers.|Il sarto aggiusta i pantaloni.|Портной подгоняет брюки.
laundry|ˈlɔːndri|прачечная|The laundry is in the centre.|La lavanderia è in centro.|Прачечная в центре.
hairdresser|ˈhɛərdrɛsər| парикмахер|The hairdresser cuts the hair.|Il parrucchiere taglia i capelli.|Парикмахер стрижёт волосы.
haircut|ˈhɛərkʌt| стрижка|The haircut costs twenty euros.|Il taglio costa venti euro.|Стрижка стоит двадцать евро.
paint|peɪnt| краска; красить|The paint is fresh.|La vernice è fresca.|Краска свежая.
brush|brʌʃ| кисть; щётка|The brush is in the water.|Il pennello è nell'acqua.|Кисть в воде.
canvas|ˈkænvəs|холст|The canvas is white.|La tela è bianca.|Холст белый.
art gallery|ɑːrt ˈɡæləri|галерея|The art gallery is famous.|La galleria d'arte è famosa.|Художественная галерея известна.
concert|ˈkɒnsərt|концерт|The concert starts at nine.|Il concerto inizia alle nove.|Концерт начинается в девять.
stage|steɪdʒ| сцена|The singer is on the stage.|Il cantante è sul palco.|Певец на сцене.
audience|ˈɔːdiəns|публика, зрители|The audience applauds.|Il pubblico applaude.|Публика аплодирует.
applause|əˈplɔːz|аплодисменты|The applause is loud.|Gli applausi sono forti.|Аплодисменты громкие.
director|diˈrɛktər|режиссёр|The director talks to the actor.|Il regista parla con l'attore.|Режиссёр разговаривает с актёром.
scene|siːn|сцена (эпизод)|The final scene is exciting.|La scena finale è emozionante.|Финальная сцена волнующая.
plot|plɒt|сюжет|The plot of the film is simple.|La trama del film è semplice.|Сюжет фильма простой.
character|ˈkærəktər|персонаж|The main character is Luca.|Il personaggio principale è Luca.|Главный персонаж — Лука.
coach|koʊtʃ|тренер|The coach watches the team.|L'allenatore guarda la squadra.|Тренер смотрит на команду.
field|fiːld|поле; площадка|The football field is big.|Il campo da calcio è grande.|Футбольное поле большое.
ball|bɔːl|мяч|The ball is in the garden.|La palla è nel giardino.|Мяч в саду.
score|skɔːr|счёт (в игре)|The score is two to one.|Il punteggio è due a uno.|Счёт два — один.
draw|drɔː| рисовать|The match ends in a draw.|La partita finisce in pareggio.|Матч заканчивается вничью.
championship|ˈtʃæmpiənʃɪp|чемпионат|The championship starts in September.|Il campionato inizia in settembre.|Чемпионат начинается в сентябре.
fan|fæn| болельщик; вентилятор|The fans sing at the stadium.|I tifosi cantano allo stadio.|Болельщики поют на стадионе.
medal|ˈmɛdəl|медаль|The medal is made of gold.|La medaglia è d'oro.|Медаль золотая.
prize|praɪz|приз|The prize is a medal.|Il premio è una medaglia.|Приз — медаль.
point|pɔɪnt| точка; очко|Our team scores three points.|La nostra squadra fa tre punti.|Наша команда набирает три очка.
goal|ɡoʊl| цель; гол|The destination of the journey is Rome.|La meta del viaggio è Roma.|Цель поездки — Рим.
aim|eɪm|цель, задача|My aim is to learn.|Il mio obiettivo è imparare.|Моя цель — научиться.
result|riˈzʌlt|результат|The result is good.|Il risultato è buono.|Результат хороший.
progress|ˈprɒɡrɛs|прогресс|I make progress every day.|Faccio progressi ogni giorno.|Я делаю успехи каждый день.
mistake|mɪˈsteɪk|ошибка|The mistake is in the first paragraph.|L'errore è nel primo capoverso.|Ошибка в первом абзаце.
exercise|ˈɛksərsaɪz|упражнение|We do a grammar exercise.|Facciamo un esercizio di grammatica.|Мы делаем упражнение по грамматике.
bookshop|ˈbʊkʃɒp|книжный магазин|The bookshop is in the centre.|La libreria è in centro.|Книжный магазин в центре.
pharmacist|ˈfɑːrməsɪst|аптекарь|The pharmacist recommends a medicine.|Il farmacista consiglia una medicina.|Аптекарь советует лекарство.
illness|ˈɪlnəs|болезнь|The illness lasts a week.|La malattia dura una settimana.|Болезнь длится неделю.
fever|ˈfiːvər|жар, температура|The child has a fever.|Il bambino ha la febbre.|У ребёнка жар.
cold|koʊld| простуда; холодный|I have a bad cold.|Ho un raffreddore forte.|У меня сильная простуда.
cough|kɒf|кашель|The cough has lasted three days.|La tosse dura da tre giorni.|Кашель длит три дня.
breath|brɛθ|дыхание|Take a deep breath.|Fai un respiro profondo.|Сделай глубокий вдох.
prescription|priˈskrɪpʃən|рецепт (медицинский)|The doctor writes a prescription.|Il dottore scrive una ricetta.|Врач выписывает рецепт.
pill|pɪl|таблетка|Take a tablet with water.|Prendi una pastiglia con acqua.|Прими таблетку с водой.
cure|kjʊr| лечение; лекарство|Rest is the best cure.|Il riposo è la migliore cura.|Отдых — лучшее лечение.
secretary|ˈsɛkrəteri|секретарь|The secretary answers the phone.|La segretaria risponde al telefono.|Секретарь отвечает на телефон.
appointment|əˈpɔɪntmənt|назначенная встреча|I have an appointment at ten.|Ho un appuntamento alle dieci.|У меня встреча в десять.
toy|tɔɪ|игрушка|The child breaks the toy.|Il bambino rompe il giocattolo.|Ребёнок ломает игрушку.
ticket office|ˈtɪkɪt ˈɒfɪs|касса|The ticket office closes at eight.|La biglietteria chiude alle otto.|Касса закрывается в восемь.
spectator|spɛkˈteɪtər|зритель|The spectators applaud.|Gli spettatori applaudono.|Зрители аплодируют.
match|mætʃ| матч; спичка|The match ends in a draw.|La partita finisce in pareggio.|Матч заканчивается вничью.
team|tiːm|команда|Our team plays well.|La nostra squadra gioca bene.|Наша команда играет хорошо.
training|ˈtreɪnɪŋ|тренировка|The training lasts two hours.|L'allenamento dura due ore.|Тренировка длится два часа.
race|reɪs| соревнование|The race starts at three.|La gara inizia alle tre.|Соревнование начинается в три.
winner|ˈwɪnər|победитель|The winner receives a prize.|Il vincitore riceve un premio.|Победитель получает приз.
defeat|diˈfiːt|поражение|Defeat hurts.|La sconfitta fa male.|Поражение больно.
same|seɪm|тот же самый|We live in the same building.|Abitiamo nello stesso palazzo.|Мы живём в том же доме.
other|ˈʌðər|другой, иной|I would like another coffee.|Vorrei un altro caffè.|Я хотел бы ещё один кофе.
each|iːtʃ|каждый (по отдельности)|Every morning I drink a coffee.|Ogni mattina bevo un caffè.|Каждое утро я пью кофе.
every|ˈɛvri| каждый, всякий|All the students are present.|Tutti gli studenti sono presenti.|Все студенты присутствуют.
too|tuː| слишком; тоже|This sweater is too warm.|Questo maglione è troppo caldo.|Этот свитер слишком тёплый.
less|lɛs|меньше|I would like less sugar in the tea.|Vorrei meno zucchero nel tè.|Я хотел бы меньше сахара в чае.
better|ˈbɛtər|лучше|I feel better today.|Oggi mi sento meglio.|Сегодня я чувствую себя лучше.
worse|wɜːrs|хуже|The weather is getting worse and worse.|Il tempo va di peggio in peggio.|Погода становится всё хуже.
best|bɛst|лучший|This restaurant is the best.|Questo ristorante è il migliore.|Этот ресторан — лучший.
worst|wɜːrst|худший|It is the worst day of the week.|È il giorno peggiore della settimana.|Это худший день недели.
famous|ˈfeɪməs|известный, знаменитый|This actor is very famous.|Questo attore è molto famoso.|Этот актёр очень известен.
free|friː| свободный; бесплатный|I am free tomorrow evening.|Sono libero domani sera.|Я свободен завтра вечером.
busy|ˈbɪzi| занятой|The line is busy.|La linea è occupata.|Линия занята.
asleep|əˈsliːp|уснувший|The child is already asleep.|Il bambino è già addormentato.|Ребёнок уже уснул.
ill|ɪl|больной|Marco is ill today.|Marco è malato oggi.|Марко сегодня болен.
glad|ɡlæd|радостный, довольный|I am glad to see you.|Sono contento di vederti.|Я рад тебя видеть.
angry|ˈæŋɡri|злой, сердитый|The boss is angry today.|Il capo è arrabbiato oggi.|Шеф сегодня сердитый.
nervous|ˈnɜːrvəs|нервный|I am nervous before the exam.|Sono nervoso prima dell'esame.|Я нервничаю перед экзаменом.
calm|kɑːm|спокойный|The sea is calm.|Il mare è tranquillo.|Море спокойное.
nice|naɪs|приятный, милый|Your colleague is nice.|Il tuo collega è simpatico.|Твой коллега приятный.
unpleasant|ʌnˈplɛzənt|неприятный|The neighbour is unpleasant.|Il vicino è antipatico.|Сосед неприятный.
kind|kaɪnd|добрый, любезный|The lady is very kind.|La signora è molto gentile.|Дама очень любезна.
serious|ˈsɪriəs|серьёзный|The project is very serious.|Il progetto è molto serio.|Проект очень серьёзный.
funny|ˈfʌni| весёлый|This film is funny.|Questo film è divertente.|Этот фильм весёлый.
useful|ˈjuːsfəl|полезный|Your advice is very useful.|Il tuo consiglio è molto utile.|Твой совет очень полезен.
useless|ˈjuːsləs|бесполезный|It is useless to wait here.|È inutile aspettare qui.|Бесполезно ждать здесь.
necessary|ˈnɛsəsɛri|необходимый|A passport is necessary.|È necessario un passaporto.|Необходим паспорт.
possible|ˈpɒsəbəl|возможный|It is possible to book online.|È possibile prenotare online.|Возможно бронировать онлайн.
impossible|ɪmˈpɒsəbəl|невозможный|It is impossible to understand everything.|È impossibile capire tutto.|Невозможно понять всё.
special|ˈspɛʃəl|особый, специальный|Today is a special day.|Oggi è un giorno speciale.|Сегодня особенный день.
normal|ˈnɔːrməl|нормальный, обычный|It is a normal day.|È una giornata normale.|Это обычный день.
modern|ˈmɒdərn|современный|This museum is very modern.|Questo museo è molto moderno.|Этот музей очень современный.
ancient|ˈeɪnʃənt|древний, старинный|The church is very ancient.|La chiesa è molto antica.|Церковь очень древняя.
delicious|diˈlɪʃəs|очень вкусный|The pasta is delicious.|La pasta è deliziosa.|Паста очень вкусная.
salty|ˈsɔːlti|солёный|The soup is too salty.|La zuppa è troppo salata.|Суп слишком солёный.
bitter|ˈbɪtər|горький|Coffee without sugar is bitter.|Il caffè senza zucchero è amaro.|Кофе без сахара горький.
fresh|frɛʃ| свежий|The bread is still fresh.|Il pane è ancora fresco.|Хлеб ещё свежий.
wet|wɛt|мокрый|The trousers are wet.|I pantaloni sono bagnati.|Брюки мокрые.
dry|draɪ| сухой; вытирать|The road is dry.|La strada è asciutta.|Дорога сухая.
heavy|ˈhɛvi|тяжёлый|This suitcase is heavy.|Questa valigia è pesante.|Этот чемодан тяжёлый.
narrow|ˈnæroʊ|узкий|The corridor is narrow.|Il corridoio è stretto.|Коридор узкий.
wide|waɪd|широкий|The road is wide.|La strada è larga.|Дорога широкая.
deep|diːp|глубокий|The lake is very deep.|Il lago è molto profondo.|Озеро очень глубокое.
thin|θɪn|тонкий|The pencil is thin.|La matita è sottile.|Карандаш тонкий.
thick|θɪk| толстый|A thick book on the table.|Un libro grosso sul tavolo.|Толстая книга на столе.
correct|kəˈrɛkt|правильный, верный|Your answer is correct.|La tua risposta è giusta.|Твой ответ правильный.
exact|ɪɡˈzækt|точный|The address is exact.|L'indirizzo è esatto.|Адрес точный.
just|dʒʌst| только что; просто|I have just finished the work.|Ho appena finito il lavoro.|Я только что закончил работу.
backwards|ˈbækwərdz| назад|The building is a bit further back.|Il palazzo è un po' più indietro.|Дом немного дальше назад.
in front of|ɪn frʌnt ɒv| перед|The bar is in front of the station.|Il bar è davanti alla stazione.|Бар перед вокзалом.
behind|biˈhaɪnd|позади, за|The garden is behind the house.|Il giardino è dietro la casa.|Сад за домом.
probably|ˈprɒbəbli|вероятно|Probably it will rain tomorrow.|Probabilmente piove domani.|Вероятно, завтра пойдёт дождь.
unfortunately|ʌnˈfɔːrtʃənətli|к сожалению|Unfortunately I cannot come.|Purtroppo non posso venire.|К сожалению, я не могу прийти.
at least|æt liːst|по крайней мере|At least answer the question.|Rispondi almeno alla domanda.|Хотя бы ответь на вопрос.
also|ˈɔːlsoʊ|тоже, также|I also want to come.|Anche io voglio venire.|Я тоже хочу прийти.
only|ˈoʊnli| только|I stay only two days.|Resto solo due giorni.|Я остаюсь только два дня.
instead|ɪnˈstɛd| вместо, наоборот|He goes out, I instead stay.|Lui esce, io invece resto.|Он выходит, я же остаюсь.
so|soʊ| поэтому; так|It is late, so I go home.|È tardi, quindi vado a casa.|Поздно, поэтому я иду домой.
towards|təˈwɔːrdz| к|I come back around nine.|Torno verso le nove.|Я возвращаюсь около девяти.
during|ˈdʊrɪŋ|во время|I read during the journey.|Leggo durante il viaggio.|Я читаю во время поездки.
against|əˈɡɛnst| против|The match is against Milan.|La partita è contro Milano.|Матч против Милана.
without|wɪˈðaʊt|без|Coffee without sugar, please.|Caffè senza zucchero, per favore.|Кофе без сахара, пожалуйста.
about|əˈbaʊt| о, об; приблизительно|The journey lasts about two hours.|Il viaggio dura circa due ore.|Поездка длится около двух часов.
one more|wʌn mɔːr|ещё один|Another coffee, thanks.|Un altro caffè, grazie.|Ещё один кофе, спасибо.
soy milk|sɔɪ mɪlk|соевое молоко|I have soy milk in my coffee.|Prendo il latte di soia nel caffè.|Я беру соевое молоко в кофе.
toast|toʊst|тост, поджаренный хлеб|At breakfast I eat toast.|A colazione mangio il pane tostato.|На завтрак я ем тост.
eggs|ɛɡz|яйца (мн.)|I buy fresh eggs at the market.|Compro uova fresche al mercato.|Я покупаю свежие яйца на рынке.
jam|dʒæm|джем, варенье|Strawberry jam is sweet.|La marmellata di fragole è dolce.|Клубничный джем сладкий.
butter|ˈbʌtər|масло сливочное|Put a bit of butter in the pasta.|Metti un po' di burro nella pasta.|Положи немного масла в пасту.
nuts|nʌts| орехи|At Christmas we eat nuts.|A Natale mangiamo frutta secca.|На Рождество мы едим орехи.
mineral water|ˈmɪnərəl ˈwɔːtər|минеральная вода|A cold mineral water, please.|Un'acqua minerale fresca, per favore.|Холодную минеральную воду, пожалуйста.
deckchair|ˈdɛktʃɛər|шезлонг|A deckchair in the garden.|Una sedia a sdraio in giardino.|Шезлонг в саду.
meadow|ˈmɛdoʊ|луг|The cows are in the meadow.|Le mucche sono nel prato.|Коровы на лугу.
pebble|ˈpɛbəl| булыжник, галька|The stone is in the water.|Il sasso è nell'acqua.|Камень в воде.
puddle|ˈpʌdəl|лужа|The child jumps into the puddle.|Il bambino salta nella pozzanghera.|Ребёнок прыгает в лужу.
nest|nɛst|гнездо|The bird builds the nest.|L'uccello costruisce il nido.|Птица строит гнездо.
wheat|wiːt|зерно, пшеница|The wheat is ripe.|Il grano è maturo.|Пшеница созрела.
harvest|ˈhɑːrvɪst| урожай; собирать урожай|The apple harvest is in September.|La raccolta delle mele è in settembre.|Сбор яблок — в сентябре.
path|pæθ|тропинка|The path leads to the lake.|Il sentiero porta al lago.|Тропинка ведёт к озеру.
edge|ɛdʒ| край|We are at the edge of the road.|Siamo al bordo della strada.|Мы на краю дороги.
border|ˈbɔːrdər|граница|The border is near.|Il confine è vicino.|Граница близко.
map|mæp| карта|The map is on the wall.|La carta geografica è sul muro.|Карта на стене.
compass|ˈkʌmpəs|компас|The compass shows the north.|La bussola indica il nord.|Компас показывает север.
north|nɔːrθ|север|The north of Italy is industrial.|Il nord dell'Italia è industriale.|Север Италии — промышленный.
south|saʊθ|юг|The south has more sun.|Il sud ha più sole.|На юге больше солнца.
east|iːst|восток|The east is towards the sea.|L'est è verso il mare.|Восток — в сторону моря.
west|wɛst|запад|The sun sets in the west.|Il sole tramonta a ovest.|Солнце садится на западе.
temperature|ˈtɛmprətʃər|температура|The temperature is high today.|La temperatura è alta oggi.|Температура сегодня высокая.
degree|diˈɡriː| градус|It is thirty degrees in summer.|Sono trenta gradi in estate.|Летом тридцать градусов.
shade|ʃeɪd|тень|We sit in the shade.|Ci sediamo all'ombra.|Мы садимся в тень.
living room|ˈlɪvɪŋ ruːm| гостиная|The living room is a big room.|Il soggiorno è una stanza grande.|Гостиная — большая комната.
storeroom|ˈstɔːrruːm|кладовка|The brooms are in the storeroom.|Le scope sono nel ripostiglio.|Метлы в кладовке.
cellar|ˈsɛlər|подвал, погреб|The wine is in the cellar.|Il vino è in cantina.|Вино в погребе.
mattress|ˈmætrəs|матрас|The mattress is new.|Il materasso è nuovo.|Матрас новый.
sheet|ʃiːt| простыня; лист бумаги|The sheet is white.|Il lenzuolo è bianco.|Простыня белая.
bucket|ˈbʌkɪt|ведро|The bucket is in the garage.|Il secchio è nel garage.|Ведро в гараже.
rubbish|ˈrʌbɪʃ|мусор|The rubbish is outside.|La spazzatura è fuori.|Мусор снаружи.
bin|bɪn|корзина, мусорное ведро|Throw the paper into the bin.|Getta la carta nel cestino.|Брось бумагу в корзину.
detergent|diˈtɜːrdʒənt|моющее средство|The detergent is under the sink.|Il detersivo è sotto il lavandino.|Моющее средство под раковиной.
sink|sɪŋk|раковина|The plate is in the sink.|Il piatto è nel lavandino.|Тарелка в раковине.
fridge|frɪdʒ|холодильник|The milk is in the fridge.|Il latte è nel frigo.|Молоко в холодильнике.
oven|ˈʌvən|духовка, печь|The bread is in the oven.|Il pane è nel forno.|Хлеб в духовке.
pot|pɒt|кастрюля|The pot is on the fire.|La pentola è sul fuoco.|Кастрюля на огне.
pan|pæn|сковорода|The pan is hot.|La padella è calda.|Сковорода горячая.
teaspoon|ˈtiːspuːn|чайная ложка|The teaspoon is small.|Il cucchiaino è piccolo.|Чайная ложка маленькая.
curtain|ˈkɜːrtən|штора, занавеска|Close the curtain, please.|Chiudi la tenda, per favore.|Закрой штору, пожалуйста.
shutters|ˈʃʌtərz| ставни, жалюзи|The shutters are closed.|Le tapparelle sono chiuse.|Ставни закрыты.
open|ˈoʊpən|открывать|Open the window, please.|Apri la finestra, per favore.|Открой окно, пожалуйста.
close|kloʊz|закрывать|Lock the door.|Chiudi la porta a chiave.|Закрой дверь на ключ.
buy|baɪ|покупать|I buy bread every day.|Compro il pane ogni giorno.|Я покупаю хлеб каждый день.
sell|sɛl|продавать|They sell fresh fruit at the market.|Vendono frutta fresca al mercato.|Они продают свежие фрукты на рынке.
drive|draɪv|водить машину|I drive slowly in the centre.|Guido piano nel centro.|Я еду медленно в центре.
fly|flaɪ|летать|The birds fly south.|Gli uccelli volano a sud.|Птицы летят на юг.
swim|swɪm|плавать|I swim every morning in summer.|Nuoto ogni mattina d'estate.|Летом я плаваю каждое утро.
carry|ˈkæri| носить|I take the book to the library.|Porto il libro alla biblioteca.|Я несу книгу в библиотеку.
serve|sɜːrv| служить; подавать|This tool is used for cutting.|Questo strumento serve a tagliare.|Этот инструмент служит для резки.
hold|hoʊld|держать|I hold the book in my hand.|Tengo il libro in mano.|Я держу книгу в руке.
study|ˈstʌdi|учиться, изучать|They study English in the evening.|Studiano inglese alla sera.|Они учат английский вечером.
wait|weɪt|ждать|I wait for the train at the bar.|Aspetto il treno al bar.|Я жду поезд в баре.
return|rɪˈtɜːrn|возвращаться|I come home at six.|Torno a casa alle sei.|Я возвращаюсь домой в шесть.
lose|luːz|терять|I always lose the keys.|Perdo sempre le chiavi.|Я вечно теряю ключи.
manage|ˈmænɪdʒ|удаваться, справляться|I manage to understand the lesson.|Riesco a capire la lezione.|Мне удаётся понять урок.
be born|bi bɔːrn| родиться|I was born in Turin.|Sono nato a Torino.|Я родился в Турине.
win|wɪn|побеждать|Our team wins the match.|La nostra squadra vince la partita.|Наша команда выигрывает матч.
forget|fərˈɡɛt|забывать|I always forget names.|Dimentico sempre i nomi.|Я вечно забываю имена.
wake up|weɪk ʌp|просыпаться|I wake up at seven.|Mi sveglio alle sette.|Я просыпаюсь в семь.
be called|bi kɔːld|называться, зваться|My name is Luca and hers is Anna.|Mi chiamo Luca e lei Anna.|Меня зовут Лука, а её — Анна.
enjoy oneself|ɪnˈdʒɔɪ wʌnˈsɛlf| веселиться|We enjoy ourselves at the party.|Ci divertiamo alla festa.|Мы весело проводим время на вечеринке.
get up|ɡɛt ʌp|подниматься, вставать|I get up early in the morning.|Mi alzo presto la mattina.|Утром я встаю рано.
sit down|sɪt daʊn|садиться|Sit here, please.|Vi sedete qui, per favore.|Сядьте здесь, пожалуйста.
send|sɛnd| отправлять (посылку)|I send a letter to my aunt.|Mando una lettera alla zia.|Я отправляю письмо тёте.
accept|əkˈsɛpt|принимать, соглашаться|I accept your proposal.|Accetto la tua proposta.|Я принимаю твоё предложение.
refuse|rɪˈfjuːz|отказывать, отклонять|I refuse to go out tonight.|Rifiuto di uscire stasera.|Я отказываюсь идти гулять сегодня.
obtain|əbˈteɪn|получать, добывать|I get good results.|Ottengo buoni risultati.|Я получаю хорошие результаты.
repeat|rɪˈpiːt|повторять|I repeat the sentence for the professor.|Ripeto la frase per il professore.|Я повторяю фразу для профессора.
build|bɪld|строить|They are building a new house.|Costruiscono una casa nuova.|Они строят новый дом.
sing|sɪŋ|петь|We sing together at the party.|Cantiamo insieme alla festa.|Мы поём вместе на вечеринке.
play an instrument|pleɪ æn ˈɪnstrument| играть на инструменте|I play the piano every evening.|Suono il piano ogni sera.|Я играю на пианино каждый вечер.
dance|dɑːns|танцевать|We dance all night.|Balliamo tutta la notte.|Мы танцуем всю ночь.
cut|kʌt| резать|I cut the bread for dinner.|Taglio il pane per cena.|Я режу хлеб на ужин.
go up|ɡoʊ ʌp| подниматься|We go up with the lift.|Saliamo con l'ascensore.|Мы поднимаемся на лифте.
go down|ɡoʊ daʊn|спускаться|I go down the stairs slowly.|Scendo le scale piano.|Я медленно спускаюсь по лестнице.
choose|tʃuːz| выбирать|Choose your present.|Scegli il tuo regalo.|Выбирай свой подарок.
decide|diˈsaɪd|решать|We decide the programme together.|Decidiamo il programma insieme.|Мы вместе решаем программу.
explain|ɪkˈspleɪn|объяснять|The teacher explains the rule.|Il maestro spiega la regola.|Учитель объясняет правило.
describe|diˈskraɪb|описывать|I describe my city.|Descrivo la mia città.|Я описываю свой город.
translate|trænzˈleɪt|переводить|I translate the text from French.|Traduco il testo dal francese.|Я перевожу текст с французского.
promise|ˈprɒmɪs| обещание|I promise to come back soon.|Prometto di tornare presto.|Обещаю вернуться скоро.
allow|əˈlaʊ|позволять|The weather does not allow it.|Il tempo non lo permette.|Погода этого не позволяет.
solve|sɒlv|решать (проблему)|We will solve the problem tomorrow.|Risolveremo il problema domani.|Мы решим проблему завтра.
share|ʃɛər|делиться|I share the photo with you.|Condivido la foto con te.|Я делюсь с тобой фото.
add|æd|добавлять|I add salt to the soup.|Aggiungo sale alla zuppa.|Я добавляю соль в суп.
remove|rɪˈmuːv| убирать|Remove the salt from the table.|Togli il sale dalla tavola.|Убери соль со стола.
wear|wɛər| надевать; носить (одежду)|I put on a warm sweater.|Indosso un maglione caldo.|Я надеваю тёплый свитер.
wash|wɒʃ|мыть, стирать|I wash the dishes after dinner.|Lavo i piatti dopo la cena.|Я мою посуду после ужина.
tidy|ˈtaɪdi| убирать, приводить в порядок|I arrange the books on the table.|Ordino i libri sul tavolo.|Я расставляю книги на столе.
relax|rɪˈlæks|отдыхать|I rest for an hour after lunch.|Riposo un'ora dopo pranzo.|Я отдыхаю час после обеда.
visit|ˈvɪzɪt|посещать|We visit the museum of Milan.|Visitiamo il museo di Milano.|Мы посещаем музей в Милане.
invite|ɪnˈvaɪt|приглашать|I invite friends home.|Invito gli amici a casa.|Я приглашаю друзей домой.
thank|θæŋk|благодарить|I thank everyone for the help.|Ringrazio tutti per l'aiuto.|Я благодарю всех за помощь.
greet|ɡriːt|приветствовать|I greet the neighbour every morning.|Saluto il vicino ogni mattina.|Я здороваюсь с соседом каждое утро.
meet|miːt| встречать|I meet Marco at the bar.|Incontro Marco al bar.|Я встречаю Марко в баре.
laugh|læf|смеяться|We laugh at your story.|Ridiamo della tua storia.|Мы смеёмся над твоей историей.
cry|kraɪ|плакать|The child cries a lot.|Il bambino piange molto.|Ребёнок много плачет.
shout|ʃaʊt|кричать|The fan shouts at the stadium.|Il tifoso urla allo stadio.|Фанат кричит на стадионе.
deliver|diˈlɪvər| доставлять|I send the parcel tomorrow.|Spedisco il pacco domani.|Я отправлю посылку завтра.
sign|saɪn|подписывать|Sign here, please.|Firmi qui, per favore.|Подпишите здесь, пожалуйста.
copy|ˈkɒpi|копировать|I copy the sentence into the notebook.|Copio la frase nel quaderno.|Я переписываю фразу в тетрадь.
have dinner|hæv ˈdɪnər|ужинать|We have dinner at eight in the evening.|Ceniamo alle otto di sera.|Мы ужинаем в восемь вечера.
get married|ɡɛt ˈmærid|жениться, выходить замуж|They are getting married in September.|Si sposano a settembre.|Они женятся в сентябре.
exist|ɪɡˈzɪst|существовать|I do not believe dragons exist.|Non credo che i draghi esistano.|Я не верю, что драконы существуют.
be enough|bi ɪˈnʌf|быть достаточным|One sandwich is enough for me.|Un panino basta per me.|Одного бутерброда мне достаточно.
lack|læk| не хватать|I am missing two words.|Mi mancano due parole.|Мне не хватает двух слов.
contain|kənˈteɪn|содержать|The bottle contains one litre.|La bottiglia contiene un litro.|Бутылка содержит литр.
raise|reɪz|поднимать|I raise my hand to answer.|Alzo la mano per rispondere.|Я поднимаю руку, чтобы ответить.
lower|ˈloʊər|опускать|Lower the volume, please.|Abbassi il volume, per favore.|Убавь громкость, пожалуйста.
collect|kəˈlɛkt|собирать|We collect the leaves in autumn.|Raccogliamo le foglie in autunno.|Мы собираем листья осенью.
throw|θroʊ|бросать|Throw the paper into the bin.|Getta la carta nel cestino.|Брось бумагу в корзину.
push|pʊʃ|толкать|I push the door but it is closed.|Spingo la porta ma è chiusa.|Я толкаю дверь, но она закрыта.
pull|pʊl|тянуть|Pull the rope with strength.|Tira la corda con forza.|Тяни верёвку с силой.
repair|rɪˈpɛər|чинить|I repair the computer myself.|Riparo il computer da solo.|Я чиню компьютер сам.
bride|braɪd| невеста|The bride is very beautiful.|La sposa è bellissima.|Невеста очень красивая.
groom|ɡruːm| жених|The groom is very nervous.|Lo sposo è molto nervoso.|Жених очень волнуется.
patient|ˈpeɪʃənt|терпеливый|The teacher is very patient.|Il maestro è molto paziente.|Учитель очень терпеливый.
curious|ˈkjʊriəs|любопытный, любознательный|The child is very curious.|Il bambino è molto curioso.|Ребёнок очень любознательный.
lazy|ˈleɪzi|ленивый|The cat is lazy in the morning.|Il gatto è pigro la mattina.|Кот утром ленивый.
generous|ˈdʒɛnərəs|щедрый|He is a generous man.|È un uomo generoso.|Он щедрый человек.
mysterious|mɪˈstɪriəs|загадочный|The house is mysterious at night.|La casa è misteriosa di notte.|Дом ночью загадочный.
quiet|ˈkwaɪət|тихий, беззвучный|The library is silent.|La biblioteca è silenziosa.|Библиотека тихая.
noisy|ˈnɔɪzi|шумный|The neighbourhood is noisy in the evening.|Il quartiere è rumoroso di sera.|Район шумный вечером.
dangerous|ˈdeɪndʒərəs|опасный|The road is dangerous at night.|La strada è pericolosa di notte.|Дорога опасна ночью.
safe|seɪf| безопасный; надёжный|I am sure about him.|Sono sicuro di lui.|Я уверен в нём.
perfect|ˈpɜːrfɪkt|идеальный, совершенный|The answer is perfect.|La risposta è perfetta.|Ответ идеальный.
complete|kəmˈpliːt| полный|The notebook is complete.|Il quaderno è completo.|Тетрадь полная.
only one|ˈoʊnli wʌn|единственный|It is the only book I have.|È l'unico libro che ho.|Это единственная книга, которая у меня есть.
common|ˈkɒmən|общий; обычный|It is a common problem.|È un problema comune.|Это обычная проблема.
private|ˈpraɪvət|частный, личный|This garden is private.|Questo giardino è privato.|Этот сад частный.
tasty|ˈteɪsti| вкусный, аппетитный|The soup is tasty.|La minestra è gustosa.|Суп аппетитный.
healthy|ˈhɛlθi|здоровый; полезный|Healthy food helps the body.|Il cibo sano aiuta il corpo.|Здоровая еда помогает телу.
raw|rɔː|сырой|The raw fish is fresh.|Il pesce crudo è fresco.|Сырая рыба свежая.
cooked|kʊkt|варёный, приготовленный|The rice is cooked to perfection.|Il riso è cotto alla perfezione.|Рис приготовлен идеально.
comfortable|ˈkʌmftəbəl|удобный|The chair is comfortable.|La sedia è comoda.|Стул удобный.
uncomfortable|ʌnˈkʌmftəbəl|неудобный|The bed is uncomfortable.|Il letto è scomodo.|Кровать неудобная.
charming|ˈtʃɑːrmɪŋ| очаровательный|The city is charming at night.|La città è affascinante di sera.|Город очарователен вечером.
wonderful|ˈwʌndərfəl|чудесный|The sunset is wonderful.|Il tramonto è meraviglioso.|Закат чудесный.
stunning|ˈstʌnɪŋ|великолепный|The concert is stunning.|Il concerto è stupendo.|Концерт великолепен.
terrible|ˈtɛrəbəl|ужасный|The traffic is terrible today.|Il traffico è terribile oggi.|Пробки сегодня ужасные.
horrible|ˈhɒrəbəl|ужасный, отвратительный|The weather is horrible.|Il tempo è orribile.|Погода ужасная.
smooth|smuːð|гладкий, ровный|The floor is smooth.|Il pavimento è liscio.|Пол гладкий.
shower|ˈʃaʊər|душ|The shower is warm.|La doccia è calda.|Душ тёплый.
bath|bɑːθ|ванна|The bath is full of water.|La vasca è piena d'acqua.|Ванна полна воды.
washing machine|ˈwɒʃɪŋ məʃiːn|стиральная машина|The washing machine is in the bathroom.|La lavatrice è in bagno.|Стиральная машина в ванной.
comb|koʊm|расчёска|The comb is on the shelf.|Il pettine è sulla mensola.|Расчёска на полке.
perfume|pərˈfjuːm|духи; аромат|This perfume is sweet.|Questo profumo è dolce.|Эти духи сладкие.
classroom|ˈklɑːsruːm|аудитория, класс|The classroom is big and bright.|L'aula è grande e luminosa.|Аудитория большая и светлая.
PE|ˌpiː ˈiː| физкультура|PE is on Tuesday.|La ginnastica è il martedì.|Физкультура по вторникам.
geography|dʒiˈɒɡrəfi|география|I study geography tonight.|Studio geografia stasera.|Я учу географию сегодня вечером.
maths|mæθs|математика|Mathematics is difficult.|La matematica è difficile.|Математика трудная.
Italian|ɪˈtæljən|итальянский (язык); итальянец|I study Italian every day.|Studio italiano ogni giorno.|Я учу итальянский каждый день.
English|ˈɪŋɡlɪʃ|английский (язык); англичанин|English is useful for work.|L'inglese è utile per il lavoro.|Английский полезен для работы.
moment|ˈmoʊmənt| мгновение|The right moment is now.|Il momento giusto è adesso.|Подходящий момент — сейчас.
value|ˈvæljuː|ценность; значение|This book has great value.|Questo libro ha un grande valore.|Эта книга имеет большую ценность.
system|ˈsɪstəm|система; способ|The system works well.|Il sistema funziona bene.|Система работает хорошо.
method|ˈmɛθəd|метод|My method is simple.|Il mio metodo è semplice.|Мой метод простой.
example|ɪɡˈzæmpəl|пример|I give an example.|Faccio un esempio.|Я привожу пример.
solution|səˈluːʃən|решение|The solution is easy.|La soluzione è facile.|Решение простое.
choice|tʃɔɪs|выбор|The choice is yours.|La scelta è tua.|Выбор за тобой.
opportunity|ˌɒpərˈtuːniti| случай, возможность|It is a good opportunity.|È una buona occasione.|Это хорошая возможность.
habit|ˈhæbɪt|привычка|It is a good habit.|È una buona abitudine.|Это полезная привычка.
smile|smaɪl|улыбаться|I smile at the photograph.|Sorrido alla fotografia.|Я улыбаюсь на фотографии.
breathe|briːð|дышать|I breathe the fresh air.|Respiro l'aria fresca.|Я дышу свежим воздухом.
observe|əbˈzɜːrv|наблюдать|I watch the sea from the window.|Osservo il mare dalla finestra.|Я наблюдаю за морем из окна.
taste|teɪst| пробовать на вкус; вкус|I taste the soup before adding salt.|Assaggio la zuppa prima di salare.|Я пробую суп до соли.
pour|pɔːr|наливать|I pour the water into the glass.|Verso l'acqua nel bicchiere.|Я наливаю воду в стакан.
mix|mɪks| мешать, размешивать|I mix the pasta on the plate.|Mescolo la pasta nel piatto.|Я перемешиваю пасту на тарелке.
boil|bɔɪl| варить|The water boils in five minutes.|L'acqua bolle in cinque minuti.|Вода кипит через пять минут.
get dressed|ɡɛt drɛst|одеваться|I get dressed quickly.|Mi vesto in fretta.|Я одеваюсь быстро.
turn on|tɜːrn ɒn| включать|I turn on the living room light.|Accendo la luce del salotto.|Я включаю свет в гостиной.
turn off|tɜːrn ɒf| выключать|Turn off the radio, please.|Spegni la radio, per favore.|Выключи радио, пожалуйста.
hire|ˈhaɪər|брать напрокат|I hire a bicycle for a day.|Noleggio una bicicletta per un giorno.|Я беру велосипед на день.
rent|rɛnt| сдавать в аренду; арендовать|I rent out a room in the centre.|Affitto una stanza in centro.|Я сдаю комнату в центре.
brake|breɪk| тормозить; тормоз|I brake before the corner.|Freno prima dell'angolo.|Я торможу перед поворотом.
land|lænd|приземляться|The plane lands at nine.|L'aereo atterra alle nove.|Самолёт приземляется в девять.
take off|teɪk ɒf|взлетать|The plane takes off at seven.|L'aereo decolla alle sette.|Самолёт взлетает в семь.
surf|sɜːrf| пользоваться интернетом; сёрфинг|I surf the web every evening.|Navigo sul web ogni sera.|Я сижу в интернете каждый вечер.
dive|daɪv| погружаться (под воду)|The dive is nice in the morning.|L'immersione è bella al mattino.|Погружение прекрасно утром.
cruise|kruːz|круиз|The cruise leaves from Genoa.|La crociera parte da Genova.|Круиз отплывает из Генуи.
excursion|ɪkˈskɜːrʒən|экскурсия, поход|The excursion lasts three hours.|L'escursione dura tre ore.|Экскурсия длится три часа.
guidebook|ˈɡaɪdbʊk| путеводитель|The guidebook talks about this museum.|La guida parla di questo museo.|Путеводитель рассказывает об этом музее.
tourist|ˈtʊrɪst|турист|The tourist photographs the tower.|Il turista fotografa la torre.|Турист фотографирует башню.
adventure|ədˈvɛntʃər|приключение|This journey is an adventure.|Questo viaggio è un'avventura.|Это путешествие — приключение.
memory|ˈmɛməri| воспоминание; память|The memory of the journey is nice.|Il ricordo del viaggio è bello.|Воспоминание о поездке приятно.
receipt|rɪˈsiːt|чек (кассовый)|I keep the receipt.|Conservo lo scontrino.|Я сохраняю чек.
shopping|ˈʃɒpɪŋ| покупки|I do the shopping at the market.|Faccio la spesa al mercato.|Я делаю покупки на рынке.
purchase|ˈpɜːrtʃəs|покупка|The purchase is good.|L'acquisto è buono.|Покупка удачная.
sale|seɪl| продажа|The sale starts tomorrow.|La vendita inizia domani.|Распродажа начинается завтра.
company|ˈkʌmpəni|фирма, компания|The company has a hundred employees.|L'azienda ha cento dipendenti.|У компании сто сотрудников.
advert|ˈædvɜːrt|объявление (реклама)|I read an advert in the newspaper.|Leggo un annuncio nel giornale.|Я читаю объявление в газете.
interview|ˈɪntərvjuː| собеседование|The interview is tomorrow morning.|Il colloquio è domani mattina.|Собеседование завтра утром.
course|kɔːrs|курс (обучение)|The course lasts three months.|Il corso dura tre mesi.|Курс длится три месяца.
lecture|ˈlɛktʃər|конференция, лекция|The lecture is in the main hall.|La conferenza è in aula magna.|Лекция в большом зале.
steering wheel|ˈstɪərɪŋ wiːl| руль (авто)|The steering wheel is on the right.|Il volante è a destra.|Руль справа.
wheel|wiːl|колесо|The wheel is flat.|La ruota è buca.|Колесо спущено.
helmet|ˈhɛlmɪt|шлем|The helmet is necessary on a motorbike.|Il casco è necessario in moto.|Шлем необходим на мотоцикле.
steak|steɪk| стейк|The steak is grilled.|La bistecca è alla griglia.|Стейк на гриле.
salami|səˈlɑːmi|салями|A sandwich with salami.|Un panino con il salame.|Бутерброд с салями.
tuna|ˈtuːnə|тунец|The salad with tuna is good.|L'insalata con il tonno è buona.|Салат с тунцом вкусный.
broth|brɒθ|бульон|Hot broth is good for you.|Il brodo caldo fa bene.|Горячий бульон полезен.
mozzarella|ˌmɒtsəˈrɛla|моцарелла|The mozzarella is fresh.|La mozzarella è fresca.|Моцарелла свежая.
cappuccino|ˌkæpuˈtʃiːno|капучино|A cappuccino and a croissant.|Un cappuccino e un cornetto.|Капучино и круассан.
napkin|ˈnæpkɪn|салфетка (столовая)|The napkin is white.|Il tovagliolo è bianco.|Салфетка белая.
indeed|ɪnˈdiːd| действительно|It is really a good film.|È veramente un bel film.|Это действительно хороший фильм.
early|ˈɜːrli| рано|I will come home early tonight.|Torno presto stasera.|Я приду домой рано сегодня.
late|leɪt|поздно, с опозданием|I arrived late at school.|Sono arrivato tardi a scuola.|Я пришёл в школу поздно.
by now|baɪ naʊ|уже (к этому времени)|By now it is too late.|Ormai è troppo tardi.|Уже слишком поздно.
finally|ˈfaɪnəli|наконец|Finally it is Friday!|Finalmente è venerdì!|Наконец-то пятница!
slowly|ˈsloʊli|медленно|Speak slowly, please.|Parla lentamente, per favore.|Говори медленно, пожалуйста.
quickly|ˈkwɪkli| быстро|I close the window quickly.|Chiudo rapidamente la finestra.|Я быстро закрываю окно.
come on|kʌm ɒn| ну же; давай|Come on, decide at once!|Insomma, decidi subito!|Ну же, решай немедленно!
even|ˈiːvən|даже|He even bought a motorbike.|Ha comprato addirittura una moto.|Он даже купил мотоцикл.
polite|pəˈlaɪt| вежливый|The waiter is very polite.|Il cameriere è molto educato.|Официант очень вежливый.
rude|ruːd| грубый|Don't be rude to the guests.|Non essere maleducato con gli ospiti.|Не будь грубым с гостями.
shy|ʃaɪ| стеснительный|The boy is shy at school.|Il ragazzo è timido a scuola.|Мальчик стеснительный в школе.
brave|breɪv| смелый|The firefighter is brave.|Il pompiere è coraggioso.|Пожарный смелый.
honest|ˈɒnɪst| честный|The shopkeeper is honest.|Il commerciante è onesto.|Торговец честный.
careful|ˈkɛərfəl| осторожный, внимательный|Be careful with the knife.|Sta attento col coltello.|Будь осторожен с ножом.
careless|ˈkɛərləs| невнимательный, неосторожный|A careless driver is dangerous.|Un guidatore imprudente è pericoloso.|Невнимательный водитель опасен.
strict|strɪkt| строгий|The teacher is strict.|L'insegnante è severo.|Учитель строгий.
fair|fɛər| справедливый|The decision is fair.|La decisione è giusta.|Решение справедливое.
clever|ˈklɛvər| умный, сообразительный|The student is clever.|Lo studente è sveglio.|Студент сообразительный.
wise|waɪz| мудрый|The old man is wise.|Il vecchio è saggio.|Старик мудрый.
silly|ˈsɪli| глупый, несерьёзный|It is a silly question.|È una domanda sciocca.|Это глупый вопрос.
married|ˈmærid| женатый, замужем|They are married since June.|Sono sposati da giugno.|Они женаты с июня.
single|ˈsɪŋɡəl| холостой, одинокий|My cousin is single.|Mio cugino è single.|Мой двоюродный брат холостой.
loud|laʊd| громкий|The music is too loud.|La musica è troppo forte.|Музыка слишком громкая.
soft|sɒft| мягкий; нежный|The pillow is soft.|Il cuscino è morbido.|Подушка мягкая.
hard|hɑːrd| твёрдый; тяжёлый|The bread is hard.|Il pane è duro.|Хлеб жёсткий.
sweet|swiːt| сладкий|The cake is too sweet.|La torta è troppo dolce.|Торт слишком сладкий.
warm|wɔːrm| тёплый|The soup is warm.|La minestra è calda.|Суп тёплый.
cool|kuːl| прохладный; крутой|The evening is cool.|La sera è fresca.|Вечер прохладный.
sunny|ˈsʌni| солнечный|It is a sunny day.|È una giornata soleggiata.|Это солнечный день.
cloudy|ˈklaʊdi| облачный|The sky is cloudy today.|Il cielo è nuvoloso oggi.|Небо сегодня облачное.
rainy|ˈreɪni| дождливый|It is a rainy week.|È una settimana piovosa.|Это дождливая неделя.
windy|ˈwɪndi| ветреный|It is windy at the sea.|Al mare tira vento.|У моря ветрено.
left|lɛft| левый; налево|The shop is on the left.|Il negozio è a sinistra.|Магазин слева.
planet|ˈplænɪt| планета|The Earth is a planet.|La Terra è un pianeta.|Земля — планета.
space|speɪs| космос; пространство|I dream of space travel.|Sogno un viaggio nello spazio.|Я мечтаю о космическом путешествии.
tray|treɪ| поднос|The tray is on the table.|Il vassoio è sul tavolo.|Поднос на столе.
kettle|ˈkɛtəl| чайник (для кипячения)|The kettle is on the stove.|Il bollitore è sul fornello.|Чайник на плите.
cupboard|ˈkʌbərd| шкаф (кухонный)|The cups are in the cupboard.|Le tazze sono nell'armadio.|Чашки в шкафу.
shelf|ʃɛlf| полка|The book is on the shelf.|Il libro è sullo scaffale.|Книга на полке.
drawer|drɔːr|ящик (стола)|The photos are in the drawer.|Le foto sono nel cassetto.|Фотографии в ящике.
armchair|ˈɑːrmtʃɛər| кресло|The armchair is near the window.|La poltrona è vicino alla finestra.|Кресло у окна.
carpet|ˈkɑːrpɪt|ковёр|The carpet is new.|Il tappeto è nuovo.|Ковёр новый.
mirror|ˈmɪrər|зеркало|I look in the mirror before going out.|Guardo lo specchio prima di uscire.|Я смотрю в зеркало перед выходом.
soap|soʊp|мыло|The soap is in the bathroom.|Il sapone è nel bagno.|Мыло в ванной.
towel|ˈtaʊəl|полотенце|The towel is clean.|L'asciugamano è pulito.|Полотенце чистое.
pillow|ˈpɪloʊ|подушка|The pillow is soft.|Il cuscino è morbido.|Подушка мягкая.
blanket|ˈblæŋkɪt|одеяло|The blanket is on the bed.|La coperta è sul letto.|Одеяло на кровати.
hammer|ˈhæmər| молоток|The hammer is in the box.|Il martello è nella cassetta.|Молоток в коробке.
nail|neɪl| гвоздь|The nail is in the wall.|Il chiodo è nel muro.|Гвоздь в стене.
rope|roʊp| верёвка|Pull the rope with strength.|Tira la corda con forza.|Тяни верёвку с силой.
gate|ɡeɪt| ворота, калитка|The gate is closed.|Il cancello è chiuso.|Калитка закрыта.
chimney|ˈtʃɪmni| труба, дымоход|The smoke comes out of the chimney.|Il fumo esce dal comignolo.|Дым выходит из трубы.
wave|weɪv| волна|The wave is high today.|L'onda è alta oggi.|Волна сегодня высокая.
island|ˈaɪlənd| остров|The island is beautiful in summer.|L'isola è bella d'estate.|Остров прекрасен летом.
desert|diˈzɜːrt| пустыня|The desert is dry and hot.|Il deserto è secco e caldo.|Пустыня сухая и жаркая.
jungle|ˈdʒʌŋɡəl| джунгли|The jungle is full of animals.|La giungla è piena di animali.|Джунгли полны животных.
cave|keɪv| пещера|The cave is dark.|La caverna è scura.|Пещера тёмная.
thunder|ˈθʌndər| гром|Thunder frightens the dog.|Il tuono spaventa il cane.|Гром пугает собаку.
lightning|ˈlaɪtnɪŋ| молния|Lightning illuminates the sky.|Il lampo illumina il cielo.|Молния освещает небо.
sheep|ʃiːp| овца, баран|The sheep are in the meadow.|Le pecore sono nel prato.|Овцы на лугу.
goat|ɡoʊt| коза|The goat eats the grass.|La capra mangia l'erba.|Коза ест траву.
pig|pɪɡ| свинья|The pig is in the sty.|Il maiale è nel porcile.|Свинья в свинарнике.
rabbit|ˈræbɪt| кролик|The rabbit eats a carrot.|Il coniglio mangia una carota.|Кролик ест морковь.
mouse|maʊs|мышь|A mouse is in the kitchen.|Un topo è in cucina.|В кухне мышь.
wolf|wʊlf| волк|The wolf howls at night.|Il lupo urla di notte.|Волк воет ночью.
bear|bɛər| медведь|The bear sleeps in winter.|L'orso dorme in inverno.|Медведь спит зимой.
lion|ˈlaɪən| лев|The lion is the king of the animals.|Il leone è il re degli animali.|Лев — царь зверей.
duck|dʌk| утка|The duck swims in the pond.|Il papero nuota nello stagno.|Утка плавает в пруду.
wing|wɪŋ| крыло|The bird moves its wings.|L'uccello muove le ali.|Птица машет крыльями.
feather|ˈfɛðər| перо|A feather falls from the sky.|Una piuma cade dal cielo.|Перо падает с неба.
tail|teɪl| хвост|The dog wags its tail.|Il cane scodinzola.|Собака виляет хвостом.
meal|miːl| приём пищи, трапеза|The main meal is at one p.m.|Il pasto principale è alle tredici.|Основной приём пищи в час дня.
recipe|ˈrɛsəpi|рецепт (кулинарный)|This recipe is easy.|Questa ricetta è semplice.|Этот рецепт простой.
ingredient|ɪnˈɡriːdiənt| ингредиент|Read the ingredients on the pack.|Leggi gli ingredienti sulla confezione.|Прочитай ингредиенты на упаковке.
hunger|ˈhʌŋɡər| голод|Hunger is stronger than tiredness.|La fame è più forte della stanchezza.|Голод сильнее усталости.
thirst|θɜːrst| жажда|Thirst passes with water.|La sete passa con l'acqua.|Жажда проходит с водой.
menu|ˈmɛnjuː| меню|Read the menu before ordering.|Leggi il menu prima di ordinare.|Прочитай меню перед заказом.
tip|tɪp| чаевые|Leave a tip for the waiter.|Lascia una mancia al cameriere.|Оставь чаевые официанту.
bill|bɪl|счёт (в ресторане)|The waiter brings the bill.|Il cameriere porta il conto.|Официант приносит счёт.
peel|piːl|чистить (от кожуры)|Peel the apple for the child.|Sbuccia la mela per il bambino.|Почисти яблоко для ребёнка.
chop|tʃɒp| рубить, нарезать|Chop the onion for the sauce.|Taglia la cipolla per il sugo.|Нарежь лук для соуса.
stir|stɜːr| размешивать|Stir the soup slowly.|Mescola la zuppa lentamente.|Медленно помешивай суп.
bake|beɪk| печь|Bake the cake for forty minutes.|Cuoci la torta per quaranta minuti.|Пеки торт сорок минут.
fry|fraɪ| жарить|Fry the fish in oil.|Friggi il pesce nell'olio.|Жарь рыбу в масле.
grill|ɡrɪl| жарить на гриле|Grill the meat outside.|Griglia la carne all'aperto.|Жарь мясо на открытом воздухе.
freeze|friːz| замораживать, замерзать|The water freezes at zero degrees.|L'acqua gela a zero gradi.|Вода замерзает при нуле градусов.
melt|mɛlt| таять, плавить|The snow melts in the sun.|La neve si scioglie al sole.|Снег тает на солнце.
smell|smɛl| пахнуть; нюхать|The flowers smell nice.|I fiori profumano.|Цветы приятно пахнут.
touch|tʌtʃ| трогать, трогаться|Don't touch the hot pan.|Non toccare la padella calda.|Не трогай горячую сковороду.
borrow|ˈbɒroʊ| занимать, брать взаймы|I borrow a book from the library.|Prendo un libro in prestito in biblioteca.|Я беру книгу в библиотеке.
earn|ɜːrn| зарабатывать|I earn money with this work.|Guadagno denaro con questo lavoro.|Я зарабатываю деньги этой работой.
save|seɪv| экономить, сохранять|I save money every month.|Risparmio denaro ogni mese.|Я экономлю деньги каждый месяц.
pack|pæk| упаковывать; упаковка|I pack the suitcase in the evening.|Faccio la valigia la sera.|Я собираю чемодан вечером.
arrive|əˈraɪv| прибывать|The bus arrives at three p.m.|Il bus arriva alle quindici.|Автобус прибывает в пятнадцать ноль-ноль.
travel|ˈtrævəl| путешествовать|I travel by train often.|Viaggio spesso in treno.|Я часто путешествую поездом.
climb|klaɪm| лезть, взбираться|We climb the mountain in summer.|Salammo la montagna d'estate.|Мы поднимаемся на гору летом.
zoo|zuː| зоопарк|The children visit the zoo.|I bambini visitano lo zoo.|Дети посещают зоопарк.
circus|ˈsɜːrkəs| цирк|The circus arrives in town.|Il circo arriva in città.|Цирк приезжает в город.
actress|ˈæktrəs| актриса|The actress is in the new film.|L'attrice è nel film nuovo.|Актриса в новом фильме.
role|roʊl| роль|The main role is difficult.|La parte principale è difficile.|Главная роль трудная.
main|meɪn| главный, основной|The main character is Luca.|Il personaggio principale è Luca.|Главный персонаж — Лука.
hero|ˈhɪəroʊ| герой|The hero of the story is brave.|L'eroe della storia è coraggioso.|Герой истории смелый.
exciting|ɪkˈsaɪtɪŋ| увлекательный, волнующий|The final scene is exciting.|La scena finale è emozionante.|Финальная сцена волнующая.
ending|ˈɛndɪŋ| концовка, финал|The ending of the film is happy.|Il finale del film è felice.|Финал фильма счастливый.
court|kɔːrt| корт, площадка (для игры)|The tennis court is free.|Il campo da tennis è libero.|Теннисный корт свободен.
player|ˈpleɪər| игрок|The player kicks the ball.|Il giocatore calcia la palla.|Игрок бьёт по мячу.
kick|kɪk| пинать, бить (ногой)|Kick the ball towards the goal.|Calcia la palla verso la porta.|Пни мяч в сторону ворот.
fit|fɪt| в хорошей форме; подходить|I am fit thanks to sport.|Sono in forma grazie allo sport.|Я в форме благодаря спорту.
strength|strɛŋθ| сила|You are very strong!|Hai molta forza!|У тебя большая сила!
skill|skɪl| навык, умение|Cooking is a useful skill.|Cucinare è un'abilità utile.|Готовить — полезный навык.
practice|ˈpræktɪs| практика, тренировка|Practice makes perfect.|La pratica rende perfetti.|Практика делает совершенным.
improve|ɪmˈpruːv| улучшать, улучшаться|I improve every day.|Miglioro ogni giorno.|Я улучшаюсь с каждым днём.
knowledge|ˈnɒlɪdʒ| знание, знания|Knowledge is important.|La conoscenza è importante.|Знание важно.
attention|əˈtɛnʃən| внимание|Pay attention to the teacher.|Fai attenzione al maestro.|Обрати внимание на учителя.
silence|ˈsaɪləns| тишина, молчание|The silence of the forest is nice.|Il silenzio del bosco è bello.|Тишина леса приятна.
  hot|hɑːt| жаркий| It is hot in August.| Fa caldo in agosto.| В августе жарко.
  more|mɔːr| ещё| Can I have some more tea?| Posso avere ancora un po' di tè?| Можно ещё немного чая?
  chef|ʃɛf| повар| The cook makes dinner.| Il cuoco prepara la cena.| Повар готовит ужин.
  rent out|rent aʊt| сдавать в аренду| I rent out a room in the centre.| Affitto una stanza in centro.| Я сдаю комнату в центре.
  degrees|dɪˈɡriːz| градусы| It is thirty degrees in summer.| Sono trenta gradi in estate.| Летом тридцать градусов.
  rock|rɒk| камень| The old wall is made of stone.| Il vecchio muro è di pietra.| Старая стена из камня.
  language|ˈlæŋɡwɪdʒ| язык| Italian is a beautiful language.| L'italiano è una bella lingua.| Итальянский — красивый язык.
  glove|ɡlʌv| перчатка| In winter I wear gloves.| In inverno porto i guanti.| Зимой я ношу перчатки.
  sandwich|ˈsænwɪdʒ| бутерброд| I have a sandwich at the bar.| Prendo un panino al bar.| Я беру бутерброд в баре.
  neighbourhood|ˈneɪbərhʊd| район| My neighbourhood is quiet.| Il mio quartiere è tranquillo.| Мой район тихий.
  traffic light|ˈtræfɪk laɪt| светофор| The traffic light is red.| Il semaforo è rosso.| Светофор красный.
  sheet of paper|ʃiːt əv ˈpeɪpər| лист бумаги| A sheet of white paper.| Un foglio di carta bianca.| Лист белой бумаги.
  second|ˈsɛkənd| секунда; второй| One second, I am coming.| Un secondo, sto arrivando.| Секунду, я иду.
  photo|ˈfoʊtoʊ| фото| I look at the holiday photos.| Guardo le foto delle vacanze.| Я смотрю фото из отпуска.
  backpack|ˈbækpæk| рюкзак| My backpack is heavy.| Il mio zaino è pesante.| Мой рюкзак тяжёлый.
  notebook|ˈnoʊtbʊk| тетрадь| The notebook is in the bag.| Il quaderno è nella borsa.| Тетрадь в сумке.
  pencil|ˈpɛnsəl| карандаш| The pencil is on the table.| La matita è sul tavolo.| Карандаш на столе.
  mark|mɑːrk| оценка| The exam mark is high.| Il voto dell'esame è alto.| Оценка за экзамен высокая.
  homework|ˈhoʊmwɜːrk| домашнее задание| The homework is difficult.| Il compito è difficile.| Домашнее задание трудное.
  grammar|ˈɡræmər| грамматика| Italian grammar is not easy.| La grammatica italiana non è facile.| Итальянская грамматика непростая.
  verb|vɜːrb| глагол| This verb is irregular.| Questo verbo è irregolare.| Этот глагол неправильный.
  dictionary|ˈdɪkʃənɛri| словарь| Look up the word in the dictionary.| Cerca la parola nel dizionario.| Найди слово в словаре.
  courage|ˈkʌrɪdʒ| смелость| Courage, the end is near!| Coraggio, la fine è vicina!| Смелее, конец близко!
  patience|ˈpeɪʃəns| терпение| Learning needs patience.| Serve pazienza per imparare.| Для учёбы нужно терпение.
  fear|fɪər| страх| I am afraid of the dark.| Ho paura del buio.| Я боюсь темноты.
  anger|ˈæŋɡər| злость| His answer is full of anger.| La sua risposta è piena di rabbia.| Его ответ полон злости.
  joy|dʒɔɪ| радость| His voice is full of joy.| La sua voce è piena di gioia.| Его голос полон радости.
  pain|peɪn| боль| The pain passes quickly.| Il dolore passa presto.| Боль быстро проходит.
  hope|hoʊp| надежда| There is always hope.| C'è sempre speranza.| Всегда есть надежда.
  wish|wɪʃ| желание| My wish is a journey.| Il mio desiderio è un viaggio.| Моё желание — путешествие.
  necessity|nəˈsɛsəti| нужда, необходимость| I need help.| Ho bisogno di aiuto.| Мне нужна помощь.
  aid|eɪd| помощь| Thanks for your help.| Grazie per il tuo aiuto.| Спасибо за помощь.
  advice|ədˈvaɪs| совет| The doctor's advice is useful.| Il consiglio del dottore è utile.| Совет врача полезен.
  umbrella|ʌmˈbrɛlə| зонт| I take the umbrella because it rains.| Prendo l'ombrello perché piove.| Я беру зонт, потому что идёт дождь.
  glasses|ˈɡlɑːsɪz| очки| I need my glasses.| Ho bisogno dei miei occhiali.| Мне нужны мои очки.
  bag|bæɡ| сумка| The bag is on the chair.| La borsa è sulla sedia.| Сумка на стуле.
  wallet|ˈwɑːlɪt| кошелёк| The wallet is in the pocket.| Il portafoglio è in tasca.| Кошелёк в кармане.
  coin|kɔɪn| монета| A coin is on the floor.| Una moneta è sul pavimento.| Монета на полу.
  picture|ˈpɪktʃər| картина| The picture is above the sofa.| Il quadro è sopra il divano.| Картина над диваном.
  sofa|soʊfə| диван| The cat sleeps on the sofa.| Il gatto dorme sul divano.| Кот спит на диване.
  tidy up|ˈtaɪdi ʌp| убирать, приводить в порядок| I arrange the books on the table.| Ordino i libri sul tavolo.| Я расставляю книги на столе.
  dream of|driːm əv| мечтать (о)| I dream of a journey to Italy.| Sogno un viaggio in Italia.| Я мечтаю о поездке в Италию.
  reserve|rɪˈzɜːrv| бронировать| I book a table for two.| Prenoto un tavolo per due.| Я бронирую столик на двоих.
  the same|ðə seɪm| то же самое| I take the same.| Prendo lo stesso.| Я возьму то же самое.
  quite a lot|kwaɪt ə lɒt| довольно много| I have quite a lot of work today.| Ho parecchio lavoro oggi.| У меня довольно много работы сегодня.
  performance|pəˈfɔːməns| спектакль| The show starts at nine.| Lo spettacolo inizia alle nove.| Представление начинается в девять.
  destination|ˌdestɪˈneɪʃən| цель поездки| The destination of the journey is Rome.| La meta del viaggio è Roma.| Цель поездки — Рим.
  mistakes|mɪˈsteɪks| ошибки (мн.)| Mistakes help to learn.| Gli errori aiutano a imparare.| Ошибки помогают учиться.
  newsstand|ˈnjuːzstænd| киоск печати| I buy the newspaper at the kiosk.| Compro il giornale all'edicola.| Я покупаю газету в киоске.
  head cold|hed kəʊld| простуда| I have a bad cold.| Ho un raffreddore forte.| У меня сильная простуда.
  clinic|ˈklɪnɪk| амбулатория| The outpatient clinic opens at eight.| L'ambulatorio apre alle otto.| Амбулатория открывается в восемь.
  hairdryer|ˈhɛədraɪər| фен| The hairdryer is in the bathroom.| L'asciugacapelli è nel bagno.| Фен в ванной.
  tool|tuːl| инструмент| The tool is in the garage.| L'attrezzo è nel garage.| Инструмент в гараже.
  sitting room|ˈsɪtɪŋ ruːm| салон, гостиная| The television is in the living room.| Il televisore è nel salotto.| Телевизор в гостиной.
  deadline|ˈdedlaɪn| срок окончания| The deadline is tomorrow.| La scadenza è domani.| Срок завтра.
  top-up|tɒp ʌp| пополнение| A top-up for the phone.| Una ricarica per il telefono.| Пополнение для телефона.
  barber|ˈbɑːrbər| цирюльник, парикмахер| The barber shaves the client.| Il barbiere rade il cliente.| Цирюльник бреет клиента.
  ornament|ˈɔːrnəmənt| украшение| The ornament is made of wood.| L'ornamento è di legno.| Украшение из дерева.
  easel|ˈiːzəl| мольберт| The easel is in the corner.| Il cavalletto è nell'angolo.| Мольберт в углу.
  colours|ˈkʌlərz| цвета (мн.)| The colours of the house are warm.| I colori della casa sono caldi.| Цвета дома тёплые.
  paintbrush|ˈpeɪntbrʌʃ| кисть (для краски)| The brush is in the water.| Il pennello è nell'acqua.| Кисть в воде.
  a draw|ə drɔː| ничья| The match ends in a draw.| La partita finisce in pareggio.| Матч заканчивается вничью.
  here is|hɪər ɪz| вот| Here is your book.| Ecco il tuo libro.| Вот твоя книга.
  precise|prɪˈsaɪs| точный| The timetable is exact.| L'orario è preciso.| Расписание точное.
  savour|ˈseɪvər| смаковать| I taste the ice cream slowly.| Gusto il gelato lentamente.| Я медленно смакую мороженое.
  comb one’s hair|kəʊm wʌnz hɛə| причёсываться| I comb my hair in front of the mirror.| Mi pettino davanti allo specchio.| Я причёсываюсь перед зеркалом.
  function|ˈfʌŋkʃən| функционировать| The computer works well.| Il computer funziona bene.| Компьютер работает хорошо.
  free of charge|friː əv tʃɑːdʒ| бесплатный| The museum is free on Sundays.| Il museo è gratuito la domenica.| Музей бесплатный по воскресеньям.
  shopkeeper|ˈʃɒpkiːpər| торговец| The shopkeeper opens at eight.| Il commerciante apre alle otto.| Торговец открывает в восемь.
  customer|ˈkʌstəmər| клиент| The customer asks for the bill.| Il cliente chiede il conto.| Клиент просит счёт.
  diploma|dɪˈploʊmə| диплом (школьный)| The diploma is on the wall.| Il diploma è sul muro.| Диплом на стене.
  university degree|ˌjuːnɪˈvɜːsəti dɪˈɡriː| диплом университета| I take my degree in June.| Prendo la laurea a giugno.| Я получаю диплом в июне.
  `;

WM.DATA_EN = [
  {
    id: "top-verbs-en",
    name: "100 самых частотных глаголов",
    icon: "🏃",
    tag: "глаголы",
    desc: "Опорные глаголы — без них не строится ни одна фраза.",
    size: 100,
    words: `
be|biː|быть|I am a student.|Sono studente.|Я студент.
have|hæv|иметь|I have a sister.|Ho una sorella.|У меня есть сестра.
do|duː|делать|What do you do in the evening?|Che fai la sera?|Что ты делаешь вечером?
say|seɪ|сказать|Say it again, please.|Dillo di nuovo, per favore.|Скажи это ещё раз, пожалуйста.
go|ɡoʊ|идти, ехать|I go to school by bike.|Vado a scuola in bicicletta.|Я езжу в школу на велосипеде.
can|kæn|мочь|Can I open the window?|Posso aprire la finestra?|Можно открыть окно?
get|ɡet| получать|I get many emails every day.|Ricevo tante email ogni giorno.|Я получаю много писем каждый день.
make|meɪk|делать, создавать|I make breakfast every morning.|Preparo la colazione ogni mattina.|Я готовлю завтрак каждое утро.
know|noʊ| знать|I don't know.|Non lo so.|Я не знаю.
think|θɪŋk|думать|I often think about you.|Penso spesso a te.|Я часто думаю о тебе.
take|teɪk|брать|Take an umbrella, it is raining.|Prendi un ombrello, piove.|Возьми зонт, идёт дождь.
see|siː|видеть|I see the sea from the window.|Vedo il mare dalla finestra.|Я вижу море из окна.
come|kʌm|приходить|Come to my house!|Vieni a casa mia!|Приходи ко мне домой!
want|wɑːnt|хотеть|I want an ice cream.|Voglio un gelato.|Я хочу мороженое.
look|lʊk|смотреть|I look at the stars at night.|Guardo le stelle di notte.|Я смотрю на звёзды ночью.
use|juːz|использовать|Can I use your phone?|Posso usare il tuo telefono?|Можно воспользоваться твоим телефоном?
find|faɪnd|находить|I can't find the keys.|Non trovo le chiavi.|Не могу найти ключи.
give|ɡɪv|давать|Give the book to Marco.|Dai il libro a Marco.|Дай книгу Марко.
tell|tel|рассказывать|Grandma tells a story.|La nonna racconta una storia.|Бабушка рассказывает историю.
work|wɜːrk|работать|I work in an office.|Lavoro in un ufficio.|Я работаю в офисе.
call|kɔːl| называть(ся)|Call me tonight, please.|Chiamami stasera, per favore.|Позвони мне сегодня вечером, пожалуйста.
ask|æsk|спрашивать|I ask for information at the station.|Chiedo informazioni in stazione.|Я спрашиваю информацию на вокзале.
feel|fiːl| чувствовать себя|How do you feel today?|Come ti senti oggi?|Как ты себя чувствуешь сегодня?
become|bɪˈkʌm|становиться|My sister is becoming a doctor.|Mia sorella diventa medico.|Моя сестра становится врачом.
leave|liːv| выходить, уходить|I leave the house at eight.|Esco di casa alle otto.|Я выхожу из дома в восемь.
put|pʊt| класть|I put the book on the table.|Metto il libro sul tavolo.|Я кладу книгу на стол.
let|let| позволять|Let's go home!|Andiamo a casa!|Пойдём домой!
begin|bɪˈɡɪn|начинать|The lesson begins at nine.|La lezione inizia alle nove.|Урок начинается в девять.
seem|siːm|казаться|He seems like a kind person.|Sembra una persona gentile.|Он кажется добрым человеком.
help|help|помогать|I help my mother in the kitchen.|Aiuto mia madre in cucina.|Я помогаю маме на кухне.
talk|tɔːk|разговаривать|We talk about work every day.|Parliamo di lavoro ogni giorno.|Мы разговариваем о работе каждый день.
show|ʃoʊ|показывать|I will show you my city.|Ti mostro la mia città.|Я покажу тебе мой город.
hear|hɪr| слышать|I hear a strange noise.|Sento un rumore strano.|Я слышу странный шум.
play|pleɪ| играть|I play the guitar.|Suono la chitarra.|Я играю на гитаре.
run|rʌn| бегать|I run in the park every morning.|Corro nel parco ogni mattina.|Я бегаю в парке каждое утро.
like|laɪk| нравиться|I like pizza.|Mi piace la pizza.|Мне нравится пицца.
live|lɪv|жить|I have lived in Rome for ten years.|Vivo a Roma da dieci anni.|Я живу в Риме десять лет.
believe|bɪˈliːv| верить|I don't believe this story.|Non credo a questa storia.|Я не верю в эту историю.
hold|hoʊld|держать|Hold my phone for a moment.|Tieni il mio telefono un momento.|Подержи мой телефон минуту.
bring|brɪŋ| приносить|I am bringing a present for Anna.|Porto un regalo ad Anna.|Я приношу подарок Анне.
write|raɪt|писать|I write a letter to grandma.|Scrivo una lettera alla nonna.|Я пишу письмо бабушке.
sit|sɪt| садиться|Sit down, please.|Sedetevi, per favore.|Садитесь, пожалуйста.
lose|luːz|терять, проигрывать|I always lose the keys!|Perdo sempre le chiavi!|Я вечно теряю ключи!
pay|peɪ|платить|Who is paying the bill?|Chi paga il conto?|Кто платит по счёту?
continue|kənˈtɪnjuː|продолжать|The road continues for two kilometers.|La strada continua per due chilometri.|Дорога продолжается два километра.
learn|lɜːrn| учиться|I learn new words every day.|Imparo parole nuove ogni giorno.|Я учу новые слова каждый день.
understand|ˌʌndərˈstænd|понимать|I don't understand this word.|Non capisco questa parola.|Я не понимаю это слово.
read|riːd|читать|I read a book every month.|Leggo un libro ogni mese.|Я читаю книгу каждый месяц.
spend|spend|тратить, проводить (время)|I spend the weekend with my family.|Passo il weekend con la famiglia.|Я провожу выходные с семьёй.
open|ˈoʊpən|открывать|I open the window, it is hot.|Apro la finestra, è caldo.|Я открываю окно, жарко.
walk|wɔːk| ходить пешком|I walk half an hour every day.|Cammino mezz'ora ogni giorno.|Я хожу пешком полчаса каждый день.
win|wɪn|побеждать|Our team often wins.|La nostra squadra vince spesso.|Наша команда часто побеждает.
teach|tiːtʃ| преподавать|I teach English at a school.|Insegno inglese in una scuola.|Я преподаю английский в школе.
offer|ˈɔːfər|предлагать|I offer you a coffee.|Ti offro un caffè.|Я угощаю тебя кофе.
remember|rɪˈmembər|помнить|I don't remember his name.|Non ricordo il suo nome.|Я не помню его имя.
buy|baɪ|покупать|I buy bread every morning.|Compro il pane ogni mattina.|Я покупаю хлеб каждое утро.
serve|sɜːrv| служить|The waiter serves the dinner.|Il cameriere serve la cena.|Официант подаёт ужин.
die|daɪ|умирать|Plants die without water.|Le piante muoiono senza acqua.|Растения умирают без воды.
send|send|отправлять|I am sending a message to Luca.|Mando un messaggio a Luca.|Я отправляю сообщение Лука.
build|bɪld|строить|They are building a new house.|Costruiscono una casa nuova.|Они строят новый дом.
stay|steɪ|оставаться|I am staying home today.|Rimango a casa oggi.|Я остаюсь сегодня дома.
cut|kʌt|резать|I am cutting the bread.|Taglio il pane.|Я режу хлеб.
sell|sel|продавать|We sell fruit at the market.|Vendiamo frutta al mercato.|Мы продаём фрукты на рынке.
  must|mʌst| должен| I must study tonight.| Devo studiare stasera.| Мне надо позаниматься сегодня вечером.
  eat|iːt| есть| I eat pasta every day.| Mangio la pasta ogni giorno.| Я ем пасту каждый день.
  drink|drɪŋk| пить| Do you drink water or wine?| Bevi acqua o vino?| Ты пьёшь воду или вино?
  sleep|sliːp| спать| I sleep eight hours every night.| Dormo otto ore ogni notte.| Я сплю восемь часов каждую ночь.
  look for|lʊk fɔːr| искать| I am looking for a new job.| Cerco un lavoro nuovo.| Я ищу новую работу.
  answer|ˈænsər| отвечать| I always answer the emails.| Rispondo sempre alle email.| Я всегда отвечаю на письма.
  be familiar with|bi fəˈmɪliər wɪð| быть знакомым| I am familiar with this city.| Conosco bene questa città.| Я хорошо знаю этот город.
  love|lʌv| любить| I love Italian music.| Amo la musica italiana.| Я люблю итальянскую музыку.
  finish|ˈfɪnɪʃ| заканчивать| I finish work at six.| Finisco di lavorare alle sei.| Я заканчиваю работать в шесть.
  depart|dɪˈpɑːrt| отправляться, уезжать| The train departs at nine.| Il treno parte alle nove.| Поезд отправляется в девять.
  arrive|əˈraɪv| прибывать| We arrive tomorrow morning.| Arriviamo domani mattina.| Мы приедем завтра утром.
  wait|weɪt| ждать| Wait for me here!| Aspettami qui!| Подожди меня здесь!
  enter|ˈɛntər| входить| Can we come in?| Possiamo entrare?| Мы можем войти?
  return|rɪˈtɜːrn| возвращаться| I return home at seven.| Torno a casa alle sette.| Я возвращаюсь домой в семь.
  climb|klaɪm| подниматься| Let's climb in the car.| Saliamo in macchina.| Давай сядем в машину.
  go down|ɡoʊ daʊn| спускаться| I go down at the next stop.| Scendo alla prossima fermata.| Я выхожу на следующей остановке.
  fly|flaɪ| летать| Birds fly in the sky.| Gli uccelli volano in cielo.| Птицы летают в небе.
  swim|swɪm| плавать| In summer I swim in the sea.| In estate nuoto nel mare.| Летом я плаваю в море.
  drive|draɪv| водить| I drive my father's car.| Guido la macchina di mio padre.| Я веду машину моего отца.
  cost|kɔːst| стоить| How much does this book cost?| Quanto costa questo libro?| Сколько стоит эта книга?
  close|kloʊz| закрывать| Close the door, please.| Chiudi la porta, per favore.| Закрой дверь, пожалуйста.
  pick up|pɪk ʌp| выучить| I picked up some Italian phrases.| Imparo parole nuove ogni giorno.| Я учу новые слова каждый день.
  repeat|rɪˈpiːt| повторять| Repeat, please, I didn't understand.| Ripeti, per favore, non ho capito.| Повтори, пожалуйста, я не понял.
  forget|fərˈɡɛt| забывать| I always forget my keys.| Dimentico sempre le chiavi.| Я всегда забываю ключи.
  wake up|weɪk ʌp| просыпаться| I wake up at seven.| Mi sveglio alle sette.| Я просыпаюсь в семь.
  get up|ɡet ʌp| вставать| Do you get up early on Sunday?| Ti alzi presto la domenica?| Ты встаёшь рано в воскресенье?
  have fun|hæv fʌn| веселиться| We have fun at the party.| Ci divertiamo alla festa.| Мы веселимся на празднике.
  accept|əkˈsɛpt| принимать| I accept your proposal.| Accetto la tua proposta.| Я принимаю твоё предложение.
  refuse|rɪˈfjuːz| отказывать| I refuse the invitation, I am tired.| Rifiuto l'invito, sono stanco.| Я отклоняю приглашение, я устал.
  manage|ˈmænɪdʒ| справляться, удаваться| I can't manage to sleep.| Non riesco a dormire.| Я не могу заснуть.
  be born|bi bɔːrn| рождаться| My daughter was born in May.| Mia figlia è nata in maggio.| Моя дочь родилась в мае.
  cook|kʊk| готовить| My father cooks very well.| Mio padre cucina molto bene.| Мой папа готовит очень хорошо.
  sing|sɪŋ| петь| I always sing in the shower.| Canto sempre sotto la doccia.| Я всегда пою в душе.
  dance|dæns| танцевать| We dance well together.| Balliamo bene insieme.| Мы хорошо танцуем вместе.
  draw|drɔː| рисовать| The children draw a house.| I bambini disegnano una casa.| Дети рисуют дом.
  prefer|prɪˈfɜːr| предпочитать| I prefer tea to coffee.| Preferisco il tè al caffè.| Я предпочитаю чай кофе.
  listen|ˈlɪsən| слушать| I listen to music on the bus.| Ascolto musica in autobus.| Я слушаю музыку в автобусе.
  `,
  },
  {
    id: "top-words-en",
    name: "100 самых частотных слов",
    icon: "⭐",
    tag: "частотные",
    desc: "Слова, которые встречаются в речи чаще всего.",
    size: 100,
    words: `
the|ðə|определённый артикль|The book is on the table.|Il libro è sul tavolo.|Книга на столе.
a|ə|неопределённый артикль|I have a new backpack.|Ho uno zaino nuovo.|У меня новый рюкзак.
and|ænd|и|Marco and Luca are friends.|Marco e Luca sono amici.|Марко и Лука — друзья.
or|ɔːr|или|Do you want tea or coffee?|Vuoi tè o caffè?|Хочешь чай или кофе?
but|bʌt|но|I want to come, but I am tired.|Voglio venire, ma sono stanco.|Я хочу прийти, но я устал.
if|ɪf| если|If it rains, I stay home.|Se piove, resto a casa.|Если идёт дождь, я остаюсь дома.
not|nɑːt|не|I do not understand it.|Non lo capisco.|Я не понимаю этого.
yes|jɛs|да|Yes, you are right.|Sì, hai ragione.|Да, ты прав.
no|noʊ|нет|No, thanks.|No, grazie.|Нет, спасибо.
please|pliːz| пожалуйста|A coffee, please.|Un caffè, per favore.|Кофе, пожалуйста.
thank you|ˈθæŋk juː|спасибо|Thank you for your help!|Grazie per il tuo aiuto!|Спасибо за твою помощь!
sorry|ˈsɑːri| извините|Sorry, I am late!|Scusa, sono in ritardo!|Извини, я опаздываю!
goodbye|ˌɡʊdˈbaɪ|до свидания|Goodbye and thank you!|Arrivederci e grazie!|До свидания и спасибо!
I|aɪ|я|I work, you study.|Io lavoro, tu studi.|Я работаю, ты учишься.
you|juː| ты|And you, how are you?|E tu, come stai?|А ты как?
he|hiː|он|He is my brother.|Lui è mio fratello.|Он мой брат.
she|ʃiː| она|She is my sister.|Lei è mia sorella.|Она моя сестра.
we|wiː|мы|We live in Milan.|Noi abitiamo a Milano.|Мы живём в Милане.
they|ðeɪ|они|They don't speak Italian.|Loro non parlano italiano.|Они не говорят по-итальянски.
this|ðɪs| это, этот|This book is interesting.|Questo libro è interessante.|Эта книга интересная.
that|ðæt| тот|That house is old.|Quella casa è vecchia.|Тот дом старый.
here|hɪr|здесь|Come here, please.|Vieni qui, per favore.|Иди сюда, пожалуйста.
there|ðɛr|там|The books are there, on the table.|I libri sono lì, sul tavolo.|Книги там, на столе.
now|naʊ| сейчас|I can't talk right now.|Adesso non posso parlare.|Я сейчас не могу говорить.
today|təˈdeɪ|сегодня|Today I am staying home.|Oggi resto a casa.|Сегодня я остаюсь дома.
yesterday|ˈjɛstərdeɪ|вчера|I saw Marco yesterday.|Ieri ho visto Marco.|Вчера я видел Марко.
tomorrow|təˈmɑːroʊ|завтра|Tomorrow I am going to the sea.|Domani vado al mare.|Завтра я еду на море.
always|ˈɔːlweɪz|всегда|Marco is always late.|Marco è sempre in ritardo.|Марко всегда опаздывает.
never|ˈnɛvər|никогда|I never eat meat.|Non mangio mai la carne.|Я никогда не ем мясо.
often|ˈɔːfən|часто|I often walk to work.|Spesso vado a piedi al lavoro.|Я часто хожу на работу пешком.
very|ˈvɛri|очень|You are very kind!|Sei molto gentile!|Ты очень добрый!
little|ˈlɪtəl| мало|I have little time today.|Ho poco tempo oggi.|У меня мало времени сегодня.
all|ɔːl| всё, весь|All my friends are here.|Tutti i miei amici sono qui.|Все мои друзья здесь.
nothing|ˈnʌθɪŋ| ничего|There is nothing in the fridge.|Non c'è niente nel frigorifero.|В холодильнике ничего нет.
something|ˈsʌmθɪŋ|что-то|I want to tell you something.|Voglio dirti qualcosa.|Я хочу тебе кое-что сказать.
somebody|ˈsʌmˌbɑːdi|кто-то|There is someone at the door.|C'è qualcuno alla porta.|У двери кто-то есть.
one|wʌn|один|I have only one euro.|Ho solo un euro.|У меня всего один евро.
two|tuː|два|I have two cats.|Ho due gatti.|У меня два кота.
three|θriː|три|The train leaves at three.|Il treno parte alle tre.|Поезд отправляется в три.
house|haʊs|дом|Our house is near the park.|La nostra casa è vicino al parco.|Наш дом рядом с парком.
water|ˈwɔːtər|вода|I drink two liters of water a day.|Bevo due litri d'acqua al giorno.|Я пью два литра воды в день.
day|deɪ|день|What day is it today?|Che giorno è oggi?|Какой сегодня день?
night|naɪt|ночь|At night I sleep well.|La notte dormo bene.|Ночью я сплю хорошо.
evening|ˈiːvnɪŋ|вечер|In the evening I watch TV.|La sera guardo la TV.|Вечером я смотрю телевизор.
morning|ˈmɔːrnɪŋ|утро|In the morning I drink a coffee.|La mattina bevo un caffè.|Утром я пью кофе.
year|jɪr|год|Happy New Year!|Buon anno nuovo!|С Новым годом!
month|mʌnθ|месяц|This month I am working a lot.|Questo mese lavoro molto.|В этом месяце я много работаю.
week|wiːk|неделя|I'll see you next week.|Ti vedo la prossima settimana.|Увидимся на следующей неделе.
time|taɪm| время|I don't have time now.|Non ho tempo adesso.|У меня сейчас нет времени.
road|roʊd| дорога|This road is very busy.|Questa strada è molto trafficata.|Эта дорога очень оживлённая.
city|ˈsɪti|город|Rome is a very beautiful city.|Roma è una città bellissima.|Рим — очень красивый город.
man|mæn|мужчина, человек|That man is my father.|Quell'uomo è mio padre.|Тот мужчина — мой отец.
woman|ˈwʊmən|женщина|That woman is my teacher.|Quella donna è la mia professoressa.|Та женщина — моя преподавательница.
child|tʃaɪld|ребёнок|The child is playing in the park.|Il bambino gioca nel parco.|Ребёнок играет в парке.
friend|frend|друг|Marco is my best friend.|Marco è il mio migliore amico.|Марко — мой лучший друг.
mother|ˈmʌðər| мать|My mother cooks very well.|Mia madre cucina molto bene.|Моя мама готовит очень хорошо.
father|ˈfɑːðər| отец|My father works in a bank.|Mio padre lavora in banca.|Мой папа работает в банке.
hand|hænd|рука (кисть)|I write with my right hand.|Scrivo con la mano destra.|Я пишу правой рукой.
eye|aɪ|глаз|I have something in my eye.|Ho qualcosa nell'occhio.|У меня что-то в глазу.
head|hɛd|голова|My head hurts.|Mi fa male la testa.|У меня болит голова.
food|fuːd|еда|Italian food is delicious.|Il cibo italiano è delizioso.|Итальянская еда очень вкусная.
bread|brɛd|хлеб|I buy bread every morning.|Compro il pane ogni mattina.|Я покупаю хлеб каждое утро.
wine|waɪn|вино|This wine is very good.|Questo vino è molto buono.|Это вино очень хорошее.
coffee|ˈkɔːfi|кофе|Do you want a coffee?|Vuoi un caffè?|Хочешь кофе?
money|ˈmʌni|деньги|I don't have money with me.|Non ho soldi con me.|У меня нет с собой денег.
work|wɜːrk|работа|My job is interesting.|Il mio lavoro è interessante.|Моя работа интересная.
school|skuːl|школа|My children go to school.|I miei figli vanno a scuola.|Мои дети ходят в школу.
book|bʊk|книга|This book is Marco's.|Questo libro è di Marco.|Эта книга Марко.
word|wɜːrd|слово|I don't know this word.|Non conosco questa parola.|Я не знаю это слово.
name|neɪm|имя|Write your name here, please.|Scrivi il tuo nome qui, per favore.|Напиши своё имя здесь, пожалуйста.
life|laɪf|жизнь|Life in Rome is beautiful.|La vita a Roma è bella.|Жизнь в Риме прекрасна.
world|wɜːrld|мир|The world is big.|Il mondo è grande.|Мир большой.
part|pɑːrt|часть|This is my favorite part of the film.|Questa è la mia parte preferita del film.|Это моя любимая часть фильма.
way|weɪ| способ|There is no other way.|Non c'è un altro modo.|Другого способа нет.
thing|θɪŋ| вещь|I always forget my things.|Dimentico sempre le mie cose.|Я всегда забываю свои вещи.
place|pleɪs|место|Is this seat free?|Questo posto è libero?|Это место свободно?
love|lʌv| любовь|Love is important in life.|L'amore è importante nella vita.|Любовь важна в жизни.
family|ˈfæməli|семья|My family lives in Moscow.|La mia famiglia abita a Mosca.|Моя семья живёт в Москве.
maybe|ˈmeɪbi|может быть|Maybe it will rain tomorrow.|Forse domani piove.|Может быть, завтра будет дождь.
very well|ˈvɛri wɛl|очень хорошо|The project is going very well.|Il progetto va molto bene.|Проект идёт очень хорошо.
OK|oʊˈkeɪ|ладно, хорошо|OK, see you tomorrow!|Va bene, ci vediamo domani!|Ладно, увидимся завтра!
people|ˈpiːpəl|люди|There are many people in the square.|In piazza ci sono tante persone.|На площади много людей.
true|truː|правда, верный|It is true, you are right.|È vero, hai ragione.|Это правда, ты прав.
what|wʌt| что|What time is it?|Che ora è?|Который час?
why|waɪ| почему|Why do you study Italian?|Perché studi l'italiano?|Почему ты учишь итальянский?
  how|haʊ| как| How are you?| Come stai?| Как ты?
  when|wen| когда| When does the film start?| Quando inizia il film?| Когда начинается фильм?
  where|wɛər| где, куда| Where do you live?| Dove abiti?| Где ты живёшь?
  hi|haɪ| пока, привет| Hi, how is it going?| Ciao, come va?| Привет, как дела?
  good morning|ɡʊd ˈmɔːrnɪŋ| добрый день| Good morning, doctor!| Buongiorno, dottore!| Добрый день, доктор!
  good evening|ɡʊd ˈiːvnɪŋ| добрый вечер| Good evening, madam!| Buonasera, signora!| Добрый вечер, синьора!
  good night|ɡʊd naɪt| спокойной ночи| Good night, sweet dreams!| Buonanotte, sogni d'oro!| Спокойной ночи, приятных снов!
  I'm sorry|aɪm ˈsɑːri| мне жаль| I'm sorry, I can't come.| Mi dispiace, non posso venire.| Мне жаль, я не могу прийти.
  you all|juː ɔːl| вы| Where are you all going?| Voi dove andate?| Куда вы идёте?
  madam|ˈmædəm| госпожа| Good morning, madam!| Buongiorno, signora Rossi!| Добрый день, синьора Росси!
  sir|sɜːr| господин| Good evening, sir!| Buonasera, signore!| Добрый вечер, синьор!
  yes and no|jes ənd noʊ| да и нет| Are you tired? — Yes and no.| Sei stanco? — Sì e no.| Ты устал? — И да, и нет.
  well|wɛl| хорошо| You speak Italian very well!| Parli molto bene l'italiano!| Ты очень хорошо говоришь по-итальянски!
  badly|ˈbædli| плохо| I feel bad.| Mi sento male.| Я чувствую себя плохо.
    things|θɪŋz| вещи|I always forget my things.|Dimentico sempre le mie cose.|Я всегда забываю свои вещи.
`,
  },
  {
    id: "top-300-en",
    name: "300 самых частотных слов",
    icon: "📈",
    tag: "топ-300",
    desc: "Самое нужное ядро языка — база для понимания речи.",
    size: 300,
    words: CORE_TOP,
  },
  {
    id: "top-1000-en",
    name: "1000 самых частотных слов",
    icon: "🏔️",
    tag: "топ-1000",
    desc: "Частотный список на 1000 слов: ядро плюс частая лексика повседневной речи.",
    size: 1000,
    words: CORE_TOP + CORE_EXT,
  },
  {
    id: "food-en",
    name: "Еда",
    icon: "🍝",
    tag: "еда",
    desc: "Продукты, блюда и то, чем едят.",
    words: `
pasta|ˈpɑːstə|паста, макароны|I eat pasta with tomato sauce.|Mangio la pasta al pomodoro.|Я ем пасту с помидорами.
pizza|ˈpiːtsə|пицца|Let's order a pizza tonight.|Ordiniamo una pizza stasera.|Закажем пиццу сегодня вечером.
bread|brɛd|хлеб|The bread is fresh.|Il pane è fresco.|Хлеб свежий.
water|ˈwɔːtər|вода|I drink two liters of water a day.|Bevo due litri d'acqua al giorno.|Я пью два литра воды в день.
wine|waɪn|вино|We are drinking a glass of wine.|Beviamo un bicchiere di vino.|Мы пьём бокал вина.
beer|bɪr|пиво|A cold beer, please.|Una birra fredda, per favore.|Холодное пиво, пожалуйста.
coffee|ˈkɔːfi|кофе|The coffee is too strong.|Il caffè è troppo forte.|Кофе слишком крепкий.
milk|mɪlk|молоко|The milk is in the fridge.|Il latte è nel frigorifero.|Молоко в холодильнике.
cheese|tʃiːz|сыр|The cheese is on the plate.|Il formaggio è sul piatto.|Сыр на тарелке.
meat|miːt|мясо|This meat is very good.|Questa carne è molto buona.|Это мясо очень вкусное.
chicken|ˈtʃɪkɪn|курица|We eat chicken on Sundays.|Mangiamo il pollo la domenica.|Мы едим курицу по воскресеньям.
fish|fɪʃ|рыба|Do you want fish or meat?|Vuoi pesce o carne?|Хочешь рыбу или мясо?
ham|hæm|ветчина|The sandwich is with ham and cheese.|Il panino è con prosciutto e formaggio.|Бутерброд с ветчиной и сыром.
rice|raɪs|рис|The rice is not ready yet.|Il riso non è pronto.|Рис ещё не готов.
soup|suːp|суп|The soup is hot.|La zuppa è calda.|Суп горячий.
salad|ˈsæləd|салат|A mixed salad, please.|Un'insalata mista, per favore.|Смешанный салат, пожалуйста.
tomato|təˈmeɪtoʊ|помидор|I put tomato in the salad.|Metto il pomodoro nell'insalata.|Я кладу помидор в салат.
egg|ɛɡ|яйцо|The eggs are in the fridge.|Le uova sono in frigorifero.|Яйца в холодильнике.
butter|ˈbʌtər|масло (сливочное)|We put butter on bread.|Mettiamo il burro sul pane.|Мы кладём масло на хлеб.
sugar|ˈʃʊɡər|сахар|Two sugars in the tea, please.|Due zuccheri nel tè, per favore.|Два кусочка сахара в чай, пожалуйста.
salt|sɔːlt|соль|Is there enough salt?|C'è abbastanza sale?|Соли достаточно?
pepper|ˈpɛpər|перец|The pepper is too spicy.|Il pepe è troppo piccante.|Перец слишком острый.
fruit|fruːt|фрукты|The fruit is on the table.|La frutta è sul tavolo.|Фрукты на столе.
apple|ˈæpəl|яблоко|I eat an apple every day.|Mangio una mela ogni giorno.|Я ем яблоко каждый день.
banana|bəˈnænə|банан|The monkey eats a banana.|La scimmia mangia una banana.|Обезьяна ест банан.
orange|ˈɔːrɪndʒ|апельсин|I drink orange juice.|Bevo un succo d'arancia.|Я пью апельсиновый сок.
lemon|ˈlɛmən|лимон|Tea with lemon, please.|Il tè con limone, per favore.|Чай с лимоном, пожалуйста.
ice cream|ˌaɪs ˈkriːm|мороженое|Two ice creams, please!|Due gelati, per favore!|Два мороженых, пожалуйста!
cake|keɪk|торт|This cake is homemade.|Questa torta è fatta in casa.|Этот торт домашний.
dessert|dɪˈzɜːrt| десерт|I don't eat sweets in the evening.|Non mangio dolci la sera.|Я не ем сладкое вечером.
plate|pleɪt| тарелка|The plate is clean.|Il piatto è pulito.|Тарелка чистая.
fork|fɔːrk|вилка|The fork is on the left.|La forchetta è a sinistra.|Вилка слева.
spoon|spuːn|ложка|Can you give me a spoon?|Mi dai un cucchiaio?|Дашь мне ложку?
knife|naɪf|нож|I cut the meat with the knife.|Taglio la carne col coltello.|Я режу мясо ножом.
glass|ɡlæs|стакан|I'd like a glass of wine.|Vorrei un bicchiere di vino.|Я хотел бы бокал вина.
cup|kʌp|чашка|This cup is mine.|Questa tazza è mia.|Эта чашка моя.
bottle|ˈbɑːtəl|бутылка|A bottle of water, please.|Una bottiglia d'acqua, per favore.|Бутылку воды, пожалуйста.
breakfast|ˈbrɛkfəst|завтрак|Breakfast is at seven.|La colazione è alle sette.|Завтрак в семь.
lunch|lʌntʃ|обед|Lunch is ready!|Il pranzo è pronto!|Обед готов!
dinner|ˈdɪnər|ужин|Dinner is at eight.|La cena è alle otto.|Ужин в восемь.
restaurant|ˈrɛstərɑːnt|ресторан|This restaurant is very famous.|Questo ristorante è molto famoso.|Этот ресторан очень известный.
menu|ˈmɛnjuː|меню|Can I see the menu?|Posso vedere il menu?|Можно посмотреть меню?
bill|bɪl|счёт (в кафе)|The bill, please.|Il conto, per favore.|Счёт, пожалуйста.
waiter|ˈweɪtər|официант|The waiter takes the order.|Il cameriere prende l'ordine.|Официант принимает заказ.
cutlery|ˈkʌtləri|столовые приборы|The cutlery is on the table.|Le posate sono sul tavolo.|Столовые приборы на столе.
toaster|ˈtoʊstər|тостер|The toaster is in the kitchen.|Il tostapane è in cucina.|Тостер на кухне.
juicer|ˈdʒuːsər|соковыжималка|I make juice with the juicer.|Faccio la spremuta con lo spremiagrumi.|Я делаю сок соковыжималкой.
apron|ˈeɪprən|фартук|I put on an apron to cook.|Mi metto il grembiule per cucinare.|Я надеваю фартук, чтобы готовить.
pan|pæn|сковорода|The pan is on the stove.|La padella è sul fuoco.|Сковорода на плите.
chef|ʃɛf|шеф-повар|The chef prepares a new dish.|Il chef prepara un piatto nuovo.|Шеф-повар готовит новое блюдо.
appetizers|ˈæpɪtaɪzərz|закуски|The appetizers are ready.|Gli antipasti sono pronti.|Закуски готовы.
colander|ˈkʌləndər|дуршлаг|I drain the pasta with the colander.|Scolo la pasta con lo scolapasta.|Я сливаю пасту через дуршлаг.
sparkling wine|ˈspɑːrkəlɪŋ waɪn|игристое вино|We drink sparkling wine at parties.|A festa beviamo lo spumante.|На празднике мы пьём игристое вино.
scales|skeɪlz|весы|I weigh the flour with the scales.|Peso la farina con la bilancia.|Я взвешиваю муку на весах.
moka pot|ˈmoʊkə pɑːt|кофеварка (гейзерная)|I make coffee with the moka pot.|Preparo il caffè con la caffettiera.|Я готовлю кофе в гейзерной кофеварке.
  mozzarella|ˌmɒtsəˈrɛlə| моцарелла| I love pizza with mozzarella.| Amo la pizza con la mozzarella.| Я люблю пиццу с моцареллой.
  olive oil|ˈɒlɪv ɔɪl| оливковое масло| I cook with olive oil.| Cucino con l'olio d'oliva.| Я готовлю на оливковом масле.
  ice|aɪs| лёд| I want water with ice.| Vuoi acqua con il ghiaccio?| Я хочу воду со льдом.
  `,
  },
  {
    id: "clothes-en",
    name: "Одежда",
    icon: "👕",
    tag: "одежда",
    desc: "Гардероб от носков до пальто.",
    words: `
shirt|ʃɜːrt|рубашка|I am wearing a white shirt.|Indosso una camicia bianca.|Я ношу белую рубашку.
t-shirt|ˈtiːʃɜːrt|футболка|This t-shirt is too small for me.|Questa maglietta è troppo piccola per me.|Эта футболка слишком маленькая для меня.
sweater|ˈswɛtər|свитер|In winter I wear a sweater.|In inverno indosso il maglione.|Зимой я ношу свитер.
hoodie|ˈhʊdi|толстовка|The hoodie is comfortable for sport.|La felpa è comoda per lo sport.|Толстовка удобна для спорта.
jacket|ˈdʒækɪt|куртка, пиджак|I put on my jacket, it is cold.|Mi metto la giacca, fa freddo.|Я надену куртку, холодно.
coat|koʊt|пальто|The grey coat is mine.|Il cappotto grigio è mio.|Серое пальто — моё.
trousers|ˈtraʊzərz|брюки|These trousers are new.|Questi pantaloni sono nuovi.|Эти брюки новые.
jeans|dʒiːnz|джинсы|The blue jeans are Luca's.|I jeans blu sono di Luca.|Синие джинсы — Лука.
skirt|skɜːrt|юбка|My sister is wearing a red skirt.|Mia sorella porta una gonna rossa.|Моя сестра носит красную юбку.
dress|drɛs| платье|The black dress is elegant.|L'abito nero è elegante.|Чёрное платье элегантное.
shoes|ʃuːz|обувь, туфли|I put on my shoes and go out.|Mi metto le scarpe e esco.|Я обуваюсь и выхожу.
boots|buːts| сапоги|The boots are for rain.|Gli stivali sono per la pioggia.|Сапоги — для дождя.
socks|sɑːks| носки|I have new socks.|Ho calze nuove.|У меня новые носки.
belt|bɛlt|ремень|This belt is made of leather.|Questa cintura è di pelle.|Этот ремень из кожи.
hat|hæt|шляпа, шапка|In summer I wear a hat.|In estate porto il cappello.|Летом я ношу шляпу.
scarf|skɑːrf|шарф|I put on a scarf, it is cold.|Metto la sciarpa, fa freddo.|Я надену шарф, холодно.
gloves|ɡlʌvz|перчатки|The gloves keep my hands warm.|I guanti tengono le mani calde.|Перчатки согревают руки.
glasses|ˈɡlæsɪz|очки|Without glasses I don't see well.|Senza occhiali non vedo bene.|Без очков я плохо вижу.
bag|bæɡ|сумка|The bag is heavy.|La borsa è pesante.|Сумка тяжёлая.
backpack|ˈbækpæk|рюкзак|My backpack is full of books.|Il mio zaino è pieno di libri.|Мой рюкзак полон книг.
pajamas|pəˈdʒɑːməz|пижама|The pajamas are on the bed.|Il pigiama è sul letto.|Пижама на кровати.
swimsuit|ˈswɪmsuːt|купальник, плавки|I bought a new swimsuit.|Ho comprato un costume da bagno nuovo.|Я купил новый купальник.
towel|ˈtaʊəl|полотенце|The towel is in the bathroom.|L'asciugamano è nel bagno.|Полотенце в ванной.
button|ˈbʌtən|пуговица|A button fell off the shirt.|Un bottone è caduto dalla camicia.|Пуговица оторвалась от рубашки.
pocket|ˈpɑːkɪt|карман|The keys are in the pocket.|Le chiavi sono nella tasca.|Ключи в кармане.
size|saɪz|размер|What size does her son wear?|Che taglia porta suo figlio?|Какой размер носит её сын?
to try on|tuː traɪ ɑːn|примерять|Can I try on this t-shirt?|Posso provare questa maglietta?|Можно примерить эту футболку?
to wear|tuː wɛr|носить (одежду)|He always wears sunglasses.|Indossa sempre gli occhiali da sole.|Он всегда носит солнцезащитные очки.
  `,
  },
  {
    id: "body-en",
    name: "Части тела",
    icon: "🖐️",
    tag: "части тела",
    desc: "С головы до пят.",
    words: `
head|hɛd|голова|Cover your head, it is cold!|Copriti la testa, fa freddo!|Одень голову, холодно!
hair|hɛr|волосы|I have short hair.|Ho i capelli corti.|У меня короткие волосы.
eye|aɪ|глаз|The cat has one blue eye and one green eye.|Il gatto ha un occhio azzurro e uno verde.|У кота один глаз голубой, а другой зелёный.
ear|ɪr|ухо|I don't hear with my left ear.|Non sento con l'orecchio sinistro.|Я не слышу левым ухом.
nose|noʊz|нос|The dog has a wet nose.|Il cane ha il naso bagnato.|У собаки мокрый нос.
mouth|maʊθ|рот|Open your mouth, please.|Apri la bocca, per favore.|Открой рот, пожалуйста.
tooth|tuːθ|зуб|I brush my teeth three times a day.|Mi lavo i denti tre volte al giorno.|Я чищу зубы три раза в день.
tongue|tʌŋ|язык|Italian is not an easy language.|L'italiano non è una lingua facile.|Итальянский — не лёгкий язык.
neck|nɛk|шея|My neck hurts.|Mi fa male il collo.|У меня болит шея.
shoulder|ˈʃoʊldər|плечо|I have a bag on my shoulder.|Ho una borsa sulla spalla.|У меня сумка на плече.
arm|ɑːrm|рука (от плеча до кисти)|Raise your right arm!|Alza il braccio destro!|Подними правую руку!
elbow|ˈɛlboʊ|локоть|My right elbow hurts.|Mi fa male il gomito destro.|У меня болит правый локоть.
wrist|rɪst|запястье|I put my watch on my wrist.|Mi metto l'orologio al polso.|Я надеваю часы на запястье.
hand|hænd|рука (кисть)|Give me your hand!|Dammi la mano!|Дай мне руку!
finger|ˈfɪŋɡər|палец|I have a ring on my finger.|Ho un anello sul dito.|У меня кольцо на пальце.
nail|neɪl|ноготь|The thumbnail is broken.|L'unghia del pollice è rotta.|Ноготь на большом пальце сломан.
chest|tʃɛst|грудь|The heart is in the chest.|Il cuore è nel petto.|Сердце в груди.
back|bæk|спина|My back hurts.|Mi fa male la schiena.|У меня болит спина.
stomach|ˈstʌmək|живот|I have a stomachache.|Ho mal di stomaco.|У меня болит живот.
leg|lɛɡ|нога|After running my legs hurt.|Dopo la corsa mi fanno male le gambe.|После бега у меня болят ноги.
knee|niː|колено|The child's knee is dirty.|Il ginocchio del bambino è sporco.|Колено ребёнка грязное.
ankle|ˈæŋkəl|лодыжка|I have a weak ankle.|Ho una caviglia debole.|У меня слабая лодыжка.
foot|fʊt|ступня, нога|I go to work on foot.|Vado a piedi al lavoro.|Я хожу на работу пешком.
skin|skɪn|кожа|The child's skin is soft.|La pelle del bambino è morbida.|Кожа ребёнка мягкая.
heart|hɑːrt|сердце|The heart beats in the chest.|Il cuore batte nel petto.|Сердце бьётся в груди.
blood|blʌd|кровь|Blood is red.|Il sangue è rosso.|Кровь красная.
bone|boʊn|кость|The dog eats a bone.|Il cane mangia un osso.|Собака ест кость.
muscle|ˈmʌsəl|мышца|The leg muscles are strong.|I muscoli delle gambe sono forti.|Мышцы ног сильные.
brain|breɪn|мозг|The brain works at night too.|Il cervello lavora anche di notte.|Мозг работает и ночью.
  `,
  },
  {
    id: "phrasal",
    name: "Фразовые глаголы",
    icon: "🔗",
    tag: "фразовые глаголы",
    desc: "Английские phrasal verbs, без которых не понять живую речь.",
    words: `
get up|ɡɛt ʌp|вставать|I get up at seven.|Mi alzo alle sette.|Я встаю в семь.
wake up|weɪk ʌp|просыпаться|She wakes up early in the morning.|Lei si sveglia presto la mattina.|Она просыпается рано утром.
give up|ɡɪv ʌp|сдаваться|Never give up!|Non mollare mai!|Никогда не сдавайся!
look for|lʊk fɔːr|искать|I am looking for a new job.|Cerco un lavoro nuovo.|Я ищу новую работу.
look after|lʊk ˈæftər|заботиться о|Can you look after my cat?|Puoi badare al mio gatto?|Присмотришь за моим котом?
look forward to|lʊk ˈfɔːrwərd tuː|с нетерпением ждать|I look forward to your letter.|Aspetto con piacere la tua lettera.|С нетерпением жду твоего письма.
put on|pʊt ɑːn|надевать|Put on your coat, it is cold.|Mettiti il cappotto, fa freddo.|Надень пальто, холодно.
take off|teɪk ɔːf|снимать, взлетать|Take off your shoes, please.|Togliti le scarpe, per favore.|Сними обувь, пожалуйста.
turn on|tɜːrn ɑːn|включать|Turn on the light, please.|Accendi la luce, per favore.|Включи свет, пожалуйста.
turn off|tɜːrn ɔːf|выключать|Turn off the TV before sleeping.|Spegni la TV prima di dormire.|Выключи телевизор перед сном.
come back|kʌm bæk|возвращаться|He comes back home at seven.|Torna a casa alle sette.|Он возвращается домой в семь.
go on|ɡoʊ ɑːn|продолжать|Go on, I am listening!|Continua, ti ascolto!|Продолжай, я слушаю!
find out|faɪnd aʊt|выяснять|I want to find out the truth.|Voglio scoprire la verità.|Я хочу выяснить правду.
grow up|ɡroʊ ʌp|взрослеть|Children grow up so fast.|I bambini crescono così in fretta.|Дети растут так быстро.
pick up|pɪk ʌp|подбирать, забирать|I pick up my son after school.|Vado a prendere mio figlio dopo la scuola.|Я забираю сына после школы.
put off|pʊt ɔːf|откладывать|Don't put off the work until tomorrow.|Non rimandare il lavoro a domani.|Не откладывай работу на завтра.
run out of|rʌn aʊt əv|заканчиваться (о запасах)|We run out of milk.|Finisce il latte.|У нас заканчивается молоко.
set up|sɛt ʌp|организовывать|They set up a small company.|Organizzano una piccola azienda.|Они организуют маленькую компанию.
sit down|sɪt daʊn|садиться|Sit down, please.|Sedetevi, per favore.|Садитесь, пожалуйста.
stand up|stænd ʌp|вставать|Please stand up.|In piedi, per favore.|Встаньте, пожалуйста.
throw away|θroʊ əˈweɪ|выбрасывать|Throw away the old newspaper.|Butta il giornale vecchio.|Выброси старую газету.
try on|traɪ ɑːn|примерять|Can I try on this dress?|Posso provare questo abito?|Можно примерить это платье?
work out|wɜːrk aʊt|тренироваться; получаться|I work out at the gym on Mondays.|Mi alleno in palestra il lunedì.|Я тренируюсь в зале по понедельникам.
figure out|ˈfɪɡjər aʊt|понимать, разгадывать|I can't figure out this problem.|Non riesco a capire questo problema.|Не могу понять эту задачу.
break down|breɪk daʊn|ломаться (о машине)|The car breaks down on the road.|La macchina si rompe sulla strada.|Машина ломается на дороге.
bring up|brɪŋ ʌp|поднимать (тему)|Don't bring up that topic at dinner.|Non toccare quel tema a cena.|Не поднимай эту тему за ужином.
call off|kɔːl ɔːf|отменять|They call off the match.|Annullano la partita.|Они отменяют матч.
come up with|kʌm ʌp wɪð|придумывать|She comes up with a good idea.|Le viene una buona idea.|Она придумывает хорошую идею.
get along|ɡɛt əˈlɔːŋ|ладить|The two brothers get along well.|I due fratelli vanno d'accordo.|Два брата хорошо ладят.
get over|ɡɛt ˈoʊvər|пережить, выздороветь|He gets over the flu in a week.|Si riprende dall'influenza in una settimana.|Он выздоравливает от гриппа за неделю.
look up|lʊk ʌp|искать (в словаре, интернете)|Look up the word in the dictionary.|Cerca la parola nel dizionario.|Поищи слово в словаре.
pay back|peɪ bæk|возвращать долг|I pay back the loan in two years.|Restituisco il prestito in due anni.|Я возвращаю кредит за два года.
turn up|tɜːrn ʌp|появляться|Marco turns up late as always.|Marco arriva in ritardo come sempre.|Марко появляется поздно, как всегда.
give away|ɡɪv əˈweɪ|отдавать даром|We give away the old clothes.|Diamo via i vestiti vecchi.|Мы отдаём старую одежду.
  `,
  },
  {
    id: "proverbs-en",
    name: "Пословицы и поговорки",
    icon: "💬",
    tag: "пословицы",
    desc: "Народная мудрость с русскими эквивалентами.",
    words: `
Better late than never.|Лучше поздно, чем никогда
All that glitters is not gold.|Не всё то золото, что блестит
Rome wasn't built in a day.|Рим не сразу строился
Time is money.|Время — деньги
Actions speak louder than words.|Дела говорят громче слов
The early bird catches the worm.|Кто рано встаёт, тому Бог подаёт
Don't judge a book by its cover.|Встречают по одёжке
Every cloud has a silver lining.|Нет худа без добра
Practice makes perfect.|Повторение — мать ученья
When in Rome, do as the Romans do.|В чужой монастырь со своим уставом не ходят
A friend in need is a friend indeed.|Друзья познаются в беде
Knowledge is power.|Знание — сила
Haste makes waste.|Поспешишь — людей насмешишь
Two heads are better than one.|Одна голова хорошо, а две лучше
Where there's smoke, there's fire.|Нет дыма без огня
  `,
  },
  {
    id: "business-en",
    name: "Бизнес",
    icon: "💼",
    tag: "бизнес",
    desc: "Лексика офиса, договоров и денег.",
    words: `
company|ˈkʌmpəni|компания|I work for a big company.|Lavoro per una grande azienda.|Я работаю в большой компании.
firm|fɜːrm|фирма|It is a small family firm.|È una piccola ditta di famiglia.|Это маленькая семейная фирма.
boss|bɔːs|начальник|The boss signs the contracts.|Il capo firma i contratti.|Начальник подписывает договоры.
employee|ɪmˈplɔɪiː|сотрудник|The employees arrive at nine.|I dipendenti arrivano alle nove.|Сотрудники приходят в девять.
client|ˈklaɪənt|клиент|The customer is always right.|Il cliente ha sempre ragione.|Клиент всегда прав.
supplier|səˈplaɪər|поставщик|We are calling the supplier tomorrow.|Chiamiamo il fornitore domani.|Мы позвоним поставщику завтра.
contract|ˈkɑːntrækt|договор|The contract lasts two years.|Il contratto dura due anni.|Договор длится два года.
meeting|ˈmiːtɪŋ| совещание|The meeting starts at ten.|La riunione inizia alle dieci.|Совещание начинается в десять.
project|ˈprɑːdʒɛkt|проект|The project is almost finished.|Il progetto è quasi finito.|Проект почти закончен.
deadline|ˈdɛdlaɪn| срок|The deadline is the first of the month.|La scadenza è il primo del mese.|Срок — первое число месяца.
salary|ˈsæləri|зарплата|The salary comes at the end of the month.|Lo stipendio arriva alla fine del mese.|Зарплата приходит в конце месяца.
raise|reɪz|повышение (зарплаты)|I ask my boss for a raise.|Chiedo un aumento al capo.|Я прошу начальника о повышении.
hiring|ˈhaɪərɪŋ| приём на работу|The hiring of new employees starts in March.|L'assunzione di nuovi dipendenti inizia a marzo.|Приём новых сотрудников начинается в марте.
dismissal|dɪsˈmɪsəl|увольнение|Dismissal is a difficult thing.|Il licenziamento è una cosa difficile.|Увольнение — это тяжело.
invoice|ˈɪnvɔɪs|счёт-фактура|I am sending the invoice to the client.|Invio la fattura al cliente.|Я отправляю счёт клиенту.
profit|ˈprɑːfɪt|прибыль|The yearly profit is good.|Il guadagno dell'anno è buono.|Прибыль за год хорошая.
loss|lɔːs|убыток|The company has a big loss.|L'azienda ha una grande perdita.|У компании большой убыток.
market|ˈmɑːrkɪt|рынок|The Italian market is big.|Il mercato italiano è grande.|Итальянский рынок большой.
competition|ˌkɑːmpəˈtɪʃən|конкуренция|The competition is very strong.|La concorrenza è molto forte.|Конкуренция очень сильная.
corporation|ˌkɔːrpəˈreɪʃən| компания|The corporation has one hundred employees.|La società ha cento dipendenti.|В корпорации сто сотрудников.
capital|ˈkæpɪtəl|капитал|The company has a lot of capital.|L'azienda ha molto capitale.|У компании много капитала.
investment|ɪnˈvɛstmənt|инвестиция|This investment is safe.|Questo investimento è sicuro.|Эта инвестиция безопасная.
loan|loʊn|кредит|We are asking for a loan at the bank.|Chiediamo un prestito in banca.|Мы просим кредит в банке.
debt|dɛt|долг|The company has many debts.|L'azienda ha molti debiti.|У компании много долгов.
tax|tæks|налог|Taxes are high in Italy.|Le tasse sono alte in Italia.|В Италии налоги высокие.
turnover|ˈtɜːrnoʊvər|оборот|The turnover grows every year.|Il fatturato cresce ogni anno.|Оборот растёт каждый год.
goal|ɡoʊl|цель|Our goal is a new market.|Il nostro obiettivo è un nuovo mercato.|Наша цель — новый рынок.
presentation|ˌprizɛnˈteɪʃən|презентация|The presentation is tomorrow morning.|La presentazione è domani mattina.|Презентация завтра утром.
report|rɪˈpɔːrt| отчёт|I am writing a report for the boss.|Scrivo una relazione per il capo.|Я пишу отчёт для начальника.
to expire|tuː ɪkˈspaɪər|истекать (о сроке)|The contract expires in December.|Il contratto scade a dicembre.|Договор истекает в декабре.
  `,
  },
  {
    id: "it-en",
    name: "ИТ",
    icon: "💻",
    tag: "ИТ",
    desc: "Компьютеры, интернет и разработка.",
    words: `
computer|kəmˈpjuːtər|компьютер|The computer is new.|Il computer è nuovo.|Компьютер новый.
laptop|ˈlæptɑːp|ноутбук|My laptop is fast.|Il mio portatile è veloce.|Мой ноутбук быстрый.
screen|skriːn|экран|The screen is broken.|Lo schermo è rotto.|Экран разбит.
keyboard|ˈkiːbɔːrd|клавиатура|My computer's keyboard is Italian.|La tastiera del mio computer è italiana.|Клавиатура моего компьютера итальянская.
mouse|maʊs|мышь|The mouse doesn't work.|Il mouse non funziona.|Мышь не работает.
printer|ˈprɪntər|принтер|The printer is out of paper.|La stampante è senza carta.|В принтере нет бумаги.
file|faɪl|файл|The file is too big.|Il file è troppo grande.|Файл слишком большой.
folder|ˈfoʊldər|папка|Create a new folder.|Crea una cartella nuova.|Создай новую папку.
program|ˈproʊɡræm|программа|This program is free.|Questo programma è gratis.|Эта программа бесплатная.
application|ˌæplɪˈkeɪʃən|приложение|I am downloading an app to learn Italian.|Scarico un'applicazione per imparare l'italiano.|Я скачиваю приложение для изучения итальянского.
website|ˈwɛbsaɪt|сайт|This website is in Italian.|Questo sito è in italiano.|Этот сайт на итальянском.
page|peɪdʒ|страница|Open the page in the browser.|Apri la pagina nel browser.|Открой страницу в браузере.
link|lɪŋk|ссылка|Click on the blue link.|Clicca sul collegamento blu.|Кликни на синюю ссылку.
network|ˈnɛtwɜːrk|сеть|The network doesn't work today.|La rete non funziona oggi.|Сеть сегодня не работает.
password|ˈpæswɜːrd|пароль|The password has eight characters.|La password ha otto caratteri.|В пароле восемь символов.
username|ˈjuːzərneɪm|логин|My username is marco_rossi.|Il mio nome utente è marco_rossi.|Мой логин — marco_rossi.
email|ˈiːmeɪl|почта, письмо|I receive a hundred emails a day.|Ricevo cento email al giorno.|Я получаю сто писем в день.
message|ˈmɛsɪdʒ|сообщение|Send me a message on WhatsApp.|Mandami un messaggio su WhatsApp.|Отправь мне сообщение в WhatsApp.
attachment|əˈtætʃmənt|вложение|The file is in the attachment.|Il file è nell'allegato.|Файл во вложении.
to download|tuː ˌdaʊnˈloʊd|скачивать|I am downloading a film from the network.|Scarico un film dalla rete.|Я скачиваю фильм из сети.
to upload|tuː ʌpˈloʊd|загружать|I am uploading the photos to the website.|Carico le foto sul sito.|Я загружаю фото на сайт.
to save|tuː seɪv|сохранять|Save the file, please.|Salva il file, per favore.|Сохрани файл, пожалуйста.
to delete|tuː dɪˈliːt|удалять|I delete old messages.|Cancello i messaggi vecchi.|Я удаляю старые сообщения.
to copy|tuː ˈkɑːpi|копировать|I am copying the text into the document.|Copio il testo nel documento.|Я копирую текст в документ.
to paste|tuː peɪst|вставить|I paste the text into the email.|Incollo il testo nella mail.|Я вставляю текст в письмо.
update|ˈʌpdeɪt|обновление|The update takes ten minutes.|L'aggiornamento dura dieci minuti.|Обновление длится десять минут.
bug|bʌɡ|ошибка (в программе)|There is an error in the code.|C'è un errore nel codice.|В коде есть ошибка.
code|koʊd|код|The code of this program is long.|Il codice di questo programma è lungo.|Код этой программы длинный.
data|ˈdeɪtə|данные|The data is in the cloud.|I dati sono nel cloud.|Данные в облаке.
memory|ˈmɛməri|память|The phone has little memory.|Il telefono ha poca memoria.|В телефоне мало памяти.
disk|dɪsk|диск|The disk is full.|Il disco è pieno.|Диск заполнен.
connection|kəˈnɛkʃən|соединение, подключение|The connection is slow today.|La connessione è lenta oggi.|Соединение сегодня медленное.
  `,
  },
  {
    id: "travel-en",
    name: "Путешествия",
    icon: "✈️",
    tag: "путешествия",
    desc: "Аэропорт, отель, транспорт и вопросы туриста.",
    words: `
journey|ˈdʒɜːrni|путешествие|The trip to Italy lasts a week.|Il viaggio in Italia dura una settimana.|Поездка в Италию длится неделю.
trip|trɪp| поездка|We are taking a trip to the sea.|Facciamo una gita al mare.|Мы едем на поездку на море.
vacation|veɪˈkeɪʃən|отпуск, каникулы|The summer vacation starts in June.|Le vacanze estive iniziano a giugno.|Летний отпуск начинается в июне.
ticket|ˈtɪkɪt|билет|One ticket to Florence, please.|Un biglietto per Firenze, per favore.|Один билет до Флоренции, пожалуйста.
to book|tuː bʊk|бронировать|We book a hotel in the center.|Prenotiamo un hotel in centro.|Мы бронируем отель в центре.
booking|ˈbʊkɪŋ|бронь|The booking is in the name of Rossi.|La prenotazione è a nome Rossi.|Бронь на имя Росси.
hotel|hoʊˈtɛl|отель|The hotel is near the station.|L'albergo è vicino alla stazione.|Отель рядом с вокзалом.
hostel|ˈhɑːstəl|хостел|The hostel is cheap and clean.|L'ostello è economico e pulito.|Хостел дешёвый и чистый.
room|ruːm|комната, номер|We have a double room.|Abbiamo una camera doppia.|У нас двухместный номер.
suitcase|ˈsuːtkeɪs|чемодан|I am packing the suitcase tonight.|Preparo la valigia stasera.|Я собираю чемодан сегодня вечером.
luggage|ˈlʌɡɪdʒ|багаж|The luggage is heavy.|Il bagaglio è pesante.|Багаж тяжёлый.
passport|ˈpæspɔːrt|паспорт|Show me your passport, please.|Mostrami il passaporto, per favore.|Покажите паспорт, пожалуйста.
customs|ˈkʌstəmz|таможня|We go through customs after the flight.|Passiamo la dogana dopo il volo.|Мы проходим таможню после рейса.
airport|ˈɛrpɔːrt|аэропорт|The airport is thirty kilometers from the center.|L'aeroporto è a trenta chilometri dal centro.|Аэропорт в тридцати километрах от центра.
flight|flaɪt|рейс, полёт|The flight is two hours late.|Il volo ha due ore di ritardo.|Рейс опаздывает на два часа.
plane|pleɪn|самолёт|The plane flies above the clouds.|L'aereo vola sopra le nuvole.|Самолёт летит над облаками.
train|treɪn|поезд|The train leaves from platform five.|Il treno parte dal binario cinque.|Поезд отходит с пятого пути.
platform|ˈplætfɔːrm|платформа, путь|The train to Rome is on platform seven.|Il treno per Roma è al binario sette.|Поезд на Рим на седьмом пути.
station|ˈsteɪʃən| вокзал|Let's meet in front of the station.|Ci vediamo davanti alla stazione.|Встретимся перед вокзалом.
bus|bʌs|автобус|Bus number 64 goes to the center.|L'autobus numero 64 va al centro.|Автобус номер 64 идёт в центр.
taxi|ˈtæksi|такси|I am calling a taxi to the airport.|Chiamo un taxi per l'aeroporto.|Я вызываю такси в аэропорт.
rental|ˈrɛntəl|аренда|The car rental costs fifty euros a day.|Il noleggio della macchina costa cinquanta euro al giorno.|Аренда машины стоит пятьдесят евро в день.
map|mæp|карта|Buy a map of the city.|Compra una mappa della città.|Купи карту города.
tourist|ˈtʊrɪst|турист|Rome is full of tourists.|Roma è piena di turisti.|Рим полон туристов.
excursion|ɪkˈskɜːrʒən|экскурсия|The excursion lasts three hours.|L'escursione dura tre ore.|Экскурсия длится три часа.
departure|dɪˈpɑːrtʃər|отправление|The departure time is at eight.|L'orario di partenza è alle otto.|Время отправления — восемь.
arrival|əˈraɪvəl|прибытие|The arrival is expected at noon.|L'arrivo è previsto per mezzogiorno.|Прибытие ожидается в полдень.
delay|dɪˈleɪ|задержка, опоздание|Sorry for the delay!|Scusa per il ritardo!|Извини за опоздание!
exchange|ɪksˈtʃeɪndʒ|обмен|The exchange is open until six.|Il cambio è aperto fino alle sei.|Обмен открыт до шести.
direction|dəˈrɛkʃən|направление|We are going in the wrong direction.|Andiamo nella direzione sbagliata.|Мы идём не в том направлении.
Where is…?|wɛr ɪz|где находится…?|Where is the station, please?|Dov'è la stazione, per favore?|Где вокзал, пожалуйста?
How much does it cost?|ˌhaʊ ˈmʌtʃ dʌz ɪt kɔːst| сколько это стоит?|How much does the ticket cost?|Quanto costa il biglietto?|Сколько стоит билет?
  metro|ˈmetroʊ| метро| I take the metro.| Prendo la metro.| Я еду на метро.
  this week|ðɪs wiːk| на этой неделе| I am travelling this week.| Viaggio questa settimana.| Я путешествую на этой неделе.
  `,
  },
  {
    id: "finance-en",
    name: "Финансы",
    icon: "💰",
    tag: "финансы",
    desc: "Банки, счета, налоги и инвестиции.",
    words: `
money|ˈmʌni|деньги|I don't have much money with me.|Non ho molto denaro con me.|У меня нет с собой много денег.
bank|bæŋk|банк|The bank opens at nine.|La banca apre alle nove.|Банк открывается в девять.
account|əˈkaʊnt|счёт|I open an account at the bank.|Apro un conto in banca.|Я открываю счёт в банке.
credit card|ˈkrɛdɪt kɑːrd|кредитная карта|I pay with a credit card.|Pago con la carta di credito.|Я плачу кредитной картой.
ATM|ˌeɪ tiː ˈɛm|банкомат|There is an ATM near the bank.|C'è un bancomat vicino alla banca.|Рядом с банком есть банкомат.
cash|kæʃ|наличные|I pay in cash.|Pago in contanti.|Я плачу наличными.
exchange rate|ɪksˈtʃeɪndʒ reɪt| курс валют|What is the euro-dollar exchange rate?|Qual è il cambio euro-dollaro?|Какой курс евро к доллару?
loan|loʊn|заём, кредит|The house loan lasts twenty years.|Il prestito della casa dura vent'anni.|Кредит на дом длится двадцать лет.
mortgage|ˈmɔːrɡɪdʒ|ипотека|The mortgage costs eight hundred euros a month.|Il mutuo costa ottocento euro al mese.|Ипотека стоит восемьсот евро в месяц.
interest|ˈɪntrəst|процент|The interest on the loan is low.|L'interesse del prestito è basso.|Процент по кредиту низкий.
savings|ˈseɪvɪŋz| сбережения|I have a savings account.|Ho un conto di risparmio.|У меня есть сберегательный счёт.
to invest|tuː ɪnˈvɛst|инвестировать|We invest the money in a small company.|Investiamo i soldi in una piccola azienda.|Мы инвестируем деньги в маленькую компанию.
share|ʃɛr|акция|The company's shares are going up.|Le azioni della società salgono.|Акции компании растут.
stock exchange|stɑːk ɪksˈtʃeɪndʒ|биржа|The stock exchange opens at nine.|La borsa apre alle nove.|Биржа открывается в девять.
inflation|ɪnˈfleɪʃən|инфляция|Inflation is high this year.|L'inflazione è alta quest'anno.|Инфляция в этом году высокая.
tax|tæks|налог|I pay taxes in April.|Pago le tasse ad aprile.|Я плачу налоги в апреле.
expense|ɪkˈspɛns| расход|I do the shopping on Saturday.|Faccio la spesa il sabato.|Я делаю покупки по субботам.
income|ˈɪnkʌm| доход|The monthly income is two thousand euros.|Il guadagno mensile è di duemila euro.|Ежемесячный доход — две тысячи евро.
debt|dɛt|долг|I have a debt with the bank.|Ho un debito con la banca.|У меня долг перед банком.
bankruptcy|ˈbæŋkrʌptsi|банкротство|The firm risks bankruptcy.|La ditta rischia il fallimento.|Фирма рискует банкротством.
insurance|ɪnˈʃʊrəns|страховка|Car insurance is obligatory.|L'assicurazione della macchina è obbligatoria.|Страховка машины обязательна.
budget|ˈbʌdʒɪt|бюджет|The project budget is small.|Il budget del progetto è piccolo.|Бюджет проекта маленький.
  `,
  },
  {
    id: "adjectives-en",
    name: "Прилагательные",
    icon: "📏",
    tag: "прилагательные",
    desc: "Самые ходовые прилагательные для описаний.",
    words: `
big|bɪɡ|большой|They have a big house.|Hanno una casa grande.|У них большой дом.
small|smɔːl|маленький|It is a small and quiet hotel.|È un hotel piccolo e tranquillo.|Это маленький и тихий отель.
tall|tɔːl|высокий|The mountain is two thousand meters high.|La montagna è alta duemila metri.|Гора высотой две тысячи метров.
low|loʊ|низкий|The wall is low.|Il muro è basso.|Стена низкая.
long|lɔːŋ|длинный|The skirt is too long.|La gonna è troppo lunga.|Юбка слишком длинная.
  short|ʃɔːrt| короткий|The trousers are too short.|I pantaloni sono troppo corti.|Брюки слишком короткие.
new|nuː|новый|The new phone costs little.|Il telefono nuovo costa poco.|Новый телефон стоит дёшево.
old|oʊld|старый|The old town is old but beautiful.|Il centro storico è vecchio ma bello.|Старый город старый, но красивый.
young|jʌŋ|молодой|The new teacher is very young.|Il nuovo insegnante è molto giovane.|Новый учитель очень молодой.
beautiful|ˈbjuːtɪfəl|красивый|What beautiful weather today!|Che tempo bello oggi!|Какая сегодня прекрасная погода!
ugly|ˈʌɡli|некрасивый|That building is ugly.|Quell'edificio è brutto.|То здание некрасивое.
good|ɡʊd| хороший|The food here is good and cheap.|Il cibo qui è buono e economico.|Еда здесь хорошая и дешёвая.
bad|bæd| плохой|The big dog is not mean.|Il cane grande non è cattivo.|Большая собака не злая.
easy|ˈiːzi|лёгкий, простой|This question is easy.|Questa domanda è facile.|Этот вопрос лёгкий.
difficult|ˈdɪfɪkəlt|трудный|It is a difficult word to pronounce.|È una parola difficile da pronunciare.|Это трудное для произношения слово.
hot|hɑːt| горячий|The tea is still hot.|Il tè è ancora caldo.|Чай ещё горячий.
cold|koʊld|холодный|The hands are cold.|Le mani sono fredde.|Руки холодные.
fast|fæst|быстрый|My connection is fast.|La mia connessione è veloce.|Моё соединение быстрое.
slow|sloʊ|медленный|Turtles are slow.|Le tartarughe sono lente.|Черепахи медленные.
strong|strɔːŋ|сильный|Espresso coffee is very strong.|Il caffè espresso è molto forte.|Эспрессо очень крепкий.
weak|wiːk|слабый|The signal is weak here.|Il segnale è debole qui.|Здесь слабый сигнал.
full|fʊl|полный|The parking lot is full.|Il parcheggio è pieno.|Парковка заполнена.
empty|ˈɛmpti|пустой|The bottle is empty.|La bottiglia è vuota.|Бутылка пустая.
expensive|ɪkˈspɛnsɪv|дорогой|The apartments here are expensive.|Gli appartamenti qui sono cari.|Квартиры здесь дорогие.
cheap|tʃiːp|дешёвый|This hotel is cheap.|Questo albergo è economico.|Этот отель дешёвый.
rich|rɪtʃ|богатый|It is a rich and famous family.|È una famiglia ricca e famosa.|Это богатая и знаменитая семья.
poor|pʊr|бедный|Look at that poor cat in the rain.|Guarda quel povero gatto sotto la pioggia.|Посмотри на того бедного кота под дождём.
important|ɪmˈpɔːrtənt|важный|It is an important decision.|È una decisione importante.|Это важное решение.
interesting|ˈɪntrəstɪŋ|интересный|The museum is very interesting.|Il museo è molto interessante.|Музей очень интересный.
boring|ˈbɔːrɪŋ|скучный|This morning's lesson was boring.|La lezione di stamattina era noiosa.|Урок сегодня утром был скучным.
clean|kliːn|чистый|The hotel room is clean.|La camera dell'albergo è pulita.|Номер в отеле чистый.
dirty|ˈdɜːrti|грязный|The car is dirty after the trip.|L'auto è sporca dopo il viaggio.|Машина грязная после поездки.
heavy|ˈhɛvi|тяжёлый|The box is too heavy.|La scatola è troppo pesante.|Коробка слишком тяжёлая.
light|laɪt| лёгкий|This suitcase is light.|Questa valigia è leggera.|Этот чемодан лёгкий.
happy|ˈhæpi|счастливый|I am happy for you!|Sono felice per te!|Я счастлив за тебя!
sad|sæd|грустный|Why are you sad today?|Perché sei triste oggi?|Почему ты сегодня грустный?
tired|ˈtaɪərd|уставший|I am tired after work.|Sono stanco dopo il lavoro.|Я устал после работы.
hungry|ˈhʌŋɡri|голодный|The children are hungry after school.|I bambini sono affamati dopo la scuola.|Дети голодные после школы.
kind|kaɪnd| добрый|The hotel staff is very kind.|Il personale dell'albergo è molto gentile.|Персонал отеля очень добрый.
nice|naɪs| приятный|Your friend is very nice.|Il tuo amico è molto simpatico.|Твой друг очень приятный.
ready|ˈrɛdi|готовый|Dinner is ready!|La cena è pronta!|Ужин готов!
  `,
  },
  {
    id: "colors-en",
    name: "Цвета",
    icon: "🎨",
    tag: "цвета",
    desc: "Все цвета радуги.",
    words: `
red|rɛd|красный|Marco's car is red.|La macchina di Marco è rossa.|Машина Марко красная.
blue|bluː|синий|The sea is blue today.|Il mare è blu oggi.|Море сегодня синее.
light blue|ˌlaɪt ˈbluː|голубой|The sky is light blue in summer.|Il cielo è azzurro d'estate.|Летом небо голубое.
green|ɡriːn|зелёный|The traffic light is green.|Il semaforo è verde.|Светофор зелёный.
yellow|ˈjɛloʊ|жёлтый|Lemons are yellow.|I limoni sono gialli.|Лимоны жёлтые.
orange|ˈɔːrɪndʒ|оранжевый|Oranges are orange.|Le arance sono arancioni.|Апельсины оранжевые.
purple|ˈpɜːrpəl|фиолетовый|My favorite color is purple.|Il mio colore preferito è il viola.|Мой любимый цвет — фиолетовый.
pink|pɪŋk|розовый|The rose is a pink flower.|La rosa è un fiore rosa.|Роза — розовый цветок.
brown|braʊn|коричневый|The bear is brown.|L'orso è marrone.|Медведь коричневый.
black|blæk|чёрный|Grandma's cat is black.|Il gatto della nonna è nero.|Кот бабушки чёрный.
white|waɪt|белый|The snow is white.|La neve è bianca.|Снег белый.
grey|ɡreɪ|серый|The sky is grey today.|Il cielo è grigio oggi.|Небо сегодня серое.
golden|ˈɡoʊldən|золотой|The golden ring is grandma's.|L'anello dorato è della nonna.|Золотое кольцо — бабушкино.
silver|ˈsɪlvər|серебряный|The moon is silver tonight.|La luna è argentea stanotte.|Луна сегодня серебряная.
light|laɪt|светлый|My room is light blue.|La mia stanza è blu chiaro.|Моя комната светло-голубая.
dark|dɑːrk|тёмный|I prefer dark green.|Preferisco il verde scuro.|Я предпочитаю тёмно-зелёный.
  `,
  },
  {
    id: "numbers-en",
    name: "Цифры",
    icon: "🔢",
    tag: "цифры",
    desc: "Количественные и порядковые числительные.",
    words: `
zero|ˈzɪroʊ|ноль|The thermometer shows zero degrees.|Il termometro segna zero gradi.|Термометр показывает ноль градусов.
one|wʌn|один|I have only one euro.|Ho solo un euro.|У меня всего один евро.
two|tuː|два|I have two tickets to the concert.|Ho due biglietti per il concerto.|У меня два билета на концерт.
three|θriː|три|The family is three people.|La famiglia è di tre persone.|В семье три человека.
four|fɔːr|четыре|The table has four legs.|Il tavolo ha quattro gambe.|У стола четыре ножки.
five|faɪv|пять|The shop opens at five.|Il negozio apre alle cinque.|Магазин открывается в пять.
six|sɪks|шесть|My son is six years old.|Mio figlio ha sei anni.|Моему сыну шесть лет.
seven|ˈsɛvən|семь|I wake up at seven.|Mi sveglio alle sette.|Я просыпаюсь в семь.
eight|eɪt|восемь|The film starts at eight.|Il film inizia alle otto.|Фильм начинается в восемь.
nine|naɪn|девять|The train leaves at nine thirty.|Il treno parte alle nove e trenta.|Поезд отправляется в девять тридцать.
ten|tɛn|десять|It is ten in the morning.|Sono le dieci di mattina.|Сейчас десять утра.
eleven|ɪˈlɛvən|одиннадцать|The shop closes at eleven.|Il negozio chiude alle undici.|Магазин закрывается в одиннадцать.
twelve|twɛlv|двенадцать|At noon it is twelve o'clock.|A mezzogiorno sono le dodici.|В полдень двенадцать часов.
thirteen|ˌθɜːrˈtiːn|тринадцать|The boy is thirteen years old.|Il ragazzo ha tredici anni.|Мальчику тринадцать лет.
fourteen|ˌfɔːrˈtiːn|четырнадцать|The trip lasts fourteen days.|Il viaggio dura quattordici giorni.|Поездка длится четырнадцать дней.
fifteen|ˌfɪfˈtiːn|пятнадцать|The ticket costs fifteen euros.|Il biglietto costa quindici euro.|Билет стоит пятнадцать евро.
sixteen|ˌsɪksˈtiːn|шестнадцать|My cousin is sixteen years old.|Mia cugina ha sedici anni.|Моей двоюродной сестре шестнадцать лет.
seventeen|ˌsɛvənˈtiːn|семнадцать|The bill is seventeen euros.|Il conto è di diciassette euro.|Счёт — семнадцать евро.
eighteen|ˌeɪˈtiːn|восемнадцать|My brother is eighteen years old.|Mio fratello ha diciotto anni.|Моему брату восемнадцать лет.
nineteen|ˌnaɪnˈtiːn|девятнадцать|The car costs nineteen thousand euros.|La macchina costa diciannove mila euro.|Машина стоит девятнадцать тысяч евро.
twenty|ˈtwɛnti|двадцать|I have only twenty euros in my pocket.|Ho solo venti euro in tasca.|У меня в кармане всего двадцать евро.
thirty|ˈθɜːrti|тридцать|The lesson lasts thirty minutes.|La lezione dura trenta minuti.|Урок длится тридцать минут.
forty|ˈfɔːrti|сорок|My dad is forty years old.|Il mio papà ha quarant'anni.|Моему папе сорок лет.
fifty|ˈfɪfti|пятьдесят|The bicycle costs fifty euros.|La bicicletta costa cinquanta euro.|Велосипед стоит пятьдесят евро.
sixty|ˈsɪksti|шестьдесят|Grandma is sixty years old.|La nonna ha sessanta anni.|Бабушке шестьдесят лет.
seventy|ˈsɛvənti|семьдесят|Grandpa is seventy years old.|Il nonno ha settanta anni.|Дедушке семьдесят лет.
eighty|ˈeɪti|восемьдесят|Grandpa is almost eighty years old.|Il nonno ha quasi ottanta anni.|Дедушке почти восемьдесят лет.
ninety|ˈnaɪnti|девяносто|The trip lasts ninety minutes.|Il viaggio dura novanta minuti.|Поездка длится девяносто минут.
hundred|ˈhʌndrəd|сто|The course lasts a hundred hours.|Il corso dura cento ore.|Курс длится сто часов.
thousand|ˈθaʊzənd|тысяча|The phone costs a thousand euros.|Il telefono costa mille euro.|Телефон стоит тысячу евро.
million|ˈmɪljən|миллион|Milan has more than a million inhabitants.|Milano ha più di un milione di abitanti.|В Милане больше миллиона жителей.
first|fɜːrst|первый|The first bus comes at six.|Il primo autobus passa alle sei.|Первый автобус идёт в шесть.
second|ˈsɛkənd|второй|The second course is meat.|Il secondo piatto è la carne.|Второе блюдо — мясо.
third|θɜːrd|третий|I live on the third floor.|Abito al terzo piano.|Я живу на третьем этаже.
  half|hæf| половина|I have half a day free.|Ho una mezza giornata libera.|У меня свободна половина дня.
double|ˈdʌbəl|двойной|I'd like a double espresso, please.|Vorrei un caffè doppio, per favore.|Двойной эспрессо, пожалуйста.
  half a day|hæf ə deɪ| полдня| I have half a day off.| Ho solo mezzo giorno libero.| У меня всего полдня выходного.
  `,
  },
  {
    id: "sport-en",
    name: "Спорт",
    icon: "⚽",
    tag: "спорт",
    desc: "Лексика спорта: от мяча до чемпионата.",
    words: `
football|ˈfʊtbɔːl|футбол|Football is the most popular sport in Italy.|Il calcio è lo sport più popolare d'Italia.|Футбол — самый популярный спорт в Италии.
match|mætʃ|матч|The match starts at nine.|La partita inizia alle nove.|Матч начинается в девять.
team|tiːm|команда|My team is playing tonight.|La mia squadra gioca stasera.|Моя команда играет сегодня вечером.
player|ˈpleɪər|игрок|The player scores a goal.|Il giocatore segna un gol.|Игрок забивает гол.
coach|koʊtʃ|тренер|The coach talks to the team.|L'allenatore parla con la squadra.|Тренер разговаривает с командой.
goal|ɡoʊl| гол|The ball goes into the goal.|Il pallone entra in porta.|Мяч попадает в ворота.
goalkeeper|ˈɡoʊlˌkiːpər|вратарь|The goalkeeper saves the team.|Il portiere salva la squadra.|Вратарь спасает команду.
ball|bɔːl|мяч|The dog runs after the ball.|Il cane corre dietro alla palla.|Собака бежит за мячом.
field|fiːld|поле, корт|The football field is big.|Il campo da calcio è grande.|Футбольное поле большое.
race|reɪs|гонка, забег|The race starts at ten.|La gara inizia alle dieci.|Соревнование начинается в десять.
competition|ˌkɑːmpəˈtɪʃən|соревнование|The competition is international.|La competizione è internazionale.|Соревнование международное.
point|pɔɪnt|очко|My team has thirty points.|La mia squadra ha trenta punti.|У моей команды тридцать очков.
championship|ˈtʃæmpiənʃɪp|чемпионат|The championship lasts until May.|Il campionato dura fino a maggio.|Чемпионат длится до мая.
cup|kʌp|кубок|The team wins the cup.|La squadra vince la coppa.|Команда выигрывает кубок.
fan|fæn|болельщик|The fans sing at the stadium.|I tifosi cantano allo stadio.|Болельщики поют на стадионе.
training|ˈtreɪnɪŋ|тренировка|The training lasts two hours.|L'allenamento dura due ore.|Тренировка длится два часа.
swimming|ˈswɪmɪŋ|плавание|Swimming is very good for health.|Il nuoto è buonissimo per la salute.|Плавание очень полезно для здоровья.
basketball|ˈbæskɪtbɔːl|баскетбол|I play basketball with friends.|Gioco a pallacanestro con gli amici.|Я играю в баскетбол с друзьями.
volleyball|ˈvɑːlibɔːl|волейбол|Volleyball is a team sport.|La pallavolo è uno sport di squadra.|Волейбол — командный спорт.
skiing|ˈskiːɪŋ|лыжи|Skiing is a winter sport.|Lo sci è uno sport invernale.|Лыжи — зимний спорт.
medal|ˈmɛdəl|медаль|The champion receives a gold medal.|Il campione riceve una medaglia d'oro.|Чемпион получает золотую медаль.
record|ˈrɛkərd|рекорд|The swimmer breaks the world record.|Il nuotatore batte il record del mondo.|Пловец бьёт мировой рекорд.
to win|tuː wɪn|побеждать|Winning is not everything.|Vincere non è tutto.|Победа — не главное.
to lose|tuː luːz|проигрывать|The team loses the match.|La squadra perde la partita.|Команда проигрывает матч.
draw|drɔː|ничья|The match ends in a draw.|La partita finisce in pareggio.|Матч заканчивается ничьей.
  goalposts|ˈɡoʊlpoʊsts| ворота (на поле)| The ball hit the goalposts.| Il pallone ha colpito la porta.| Мяч попал в ворота.
  root for|ruːt fɔːr| болеть за| I root for Milan.| Tifo per il Milan.| Я болею за Милан.
  `,
  },
  {
    id: "irregular-verbs-en",
    name: "100 неправильных глаголов",
    icon: "🔤",
    tag: "неправильные глаголы",
    desc: "Базовые неправильные глаголы: инфинитив — Past Simple — Past Participle на одной карточке.",
    size: 100,
    words: `
be — was/were — been|biː|быть|I was at home yesterday.|Ero a casa ieri.|Я был дома вчера.
beat — beat — beaten|biːt|бить|Our team beat the champions yesterday.|La nostra squadra ha battuto i campioni ieri.|Наша команда победила чемпионов вчера.
become — became — become|bɪˈkʌm|становиться|She became a doctor two years ago.|È diventata dottoressa due anni fa.|Она стала врачом два года назад.
begin — began — begun|bɪˈɡɪn|начинать|The film began at eight.|Il film è iniziato alle otto.|Фильм начался в восемь.
bend — bent — bent|bɛnd|гнуть|He bent the wire with his hands.|Ha piegato il filo con le mani.|Он согнул проволоку руками.
bet — bet — bet|bɛt|держать пари|I bet ten euros on that game.|Ho scommesso dieci euro su quella partita.|Я поставил десять евро на ту игру.
bind — bound — bound|baɪnd|связывать|They bound the books together.|Hanno legato i libri insieme.|Они связали книги вместе.
bite — bit — bitten|baɪt|кусать|The dog bit the ball.|Il cane ha morso la palla.|Собака укусила мяч.
bleed — bled — bled|bliːd|кровоточить|His knee bled after the fall.|Il suo ginocchio ha sanguinato dopo la caduta.|Его колено кровоточило после падения.
blow — blew — blown|bloʊ|дуть|The wind blew all night.|Il vento ha soffiato tutta la notte.|Ветер дул всю ночь.
break — broke — broken|breɪk|ломать|I broke my phone last week.|Ho rotto il telefono la settimana scorsa.|Я сломал телефон на прошлой неделе.
bring — brought — brought|brɪŋ|приносить|She brought a cake to the party.|Ha portato una torta alla festa.|Она принесла торт на вечеринку.
build — built — built|bɪld|строить|They built a new house here.|Hanno costruito una nuova casa qui.|Они построили здесь новый дом.
burn — burnt/burned — burnt/burned|bɜːrn|гореть|The fire burnt all the papers.|Il fuoco ha bruciato tutti i documenti.|Огонь сжёг все бумаги.
burst — burst — burst|bɜːrst|лопаться|The balloon burst suddenly.|Il palloncino è scoppiato all'improvviso.|Шарик внезапно лопнул.
buy — bought — bought|baɪ|покупать|I bought new shoes yesterday.|Ieri ho comprato delle scarpe nuove.|Вчера я купил новые туфли.
catch — caught — caught|kætʃ|ловить|The policeman caught the thief.|Il poliziotto ha catturato il ladro.|Полицейский поймал вора.
choose — chose — chosen|tʃuːz|выбирать|I chose the red shirt.|Ho scelto la camicia rossa.|Я выбрал красную рубашку.
come — came — come|kʌm|приходить|He came home late.|È tornato a casa tardi.|Он пришёл домой поздно.
cost — cost — cost|kɒst|стоить|The ticket cost thirty euros.|Il biglietto è costato trenta euro.|Билет стоил тридцать евро.
creep — crept — crept|kriːp|ползать|The cat crept into the room.|Il gatto si è intrufolato nella stanza.|Кот прокрался в комнату.
cut — cut — cut|kʌt|резать|She cut the bread for dinner.|Ha tagliato il pane per cena.|Она нарезала хлеб на ужин.
deal — dealt — dealt|diːl|иметь дело|We dealt with the problem quickly.|Abbiamo risolto il problema in fretta.|Мы быстро разобрались с проблемой.
dig — dug — dug|dɪɡ|копать|They dug a hole in the garden.|Hanno scavato una buca nel giardino.|Они выкопали яму в саду.
do — did — done|duː|делать|I did my homework in the evening.|Ho fatto i compiti la sera.|Я сделал уроки вечером.
draw — drew — drawn|drɔː|рисовать|The child drew a house.|Il bambino ha disegnato una casa.|Ребёнок нарисовал дом.
dream — dreamt/dreamed — dreamt/dreamed|driːm|мечтать; видеть сны|I dreamt about Italy last night.|Ho sognato l'Italia stanotte.|Мне сегодня ночью снилась Италия.
drink — drank — drunk|drɪŋk|пить|He drank all the juice.|Ha bevuto tutto il succo.|Он выпил весь сок.
drive — drove — driven|draɪv|водить машину|She drove to Rome this morning.|Ha guidato fino a Roma stamattina.|Она поехала в Рим сегодня утром.
eat — ate — eaten|iːt|есть|We ate pizza for dinner.|Abbiamo mangiato la pizza a cena.|Мы ели пиццу на ужин.
fall — fell — fallen|fɔːl|падать|The leaves fell from the tree.|Le foglie sono cadute dall'albero.|Листья упали с дерева.
feed — fed — fed|fiːd|кормить|I fed the dog before lunch.|Ho dato da mangiare al cane prima di pranzo.|Я покормил собаку перед обедом.
feel — felt — felt|fiːl|чувствовать|I felt tired after work.|Mi sono sentito stanco dopo il lavoro.|Я чувствовал усталость после работы.
fight — fought — fought|faɪt|сражаться|The team fought until the end.|La squadra ha lottato fino alla fine.|Команда боролась до конца.
find — found — found|faɪnd|находить|I found the keys in the kitchen.|Ho trovato le chiavi in cucina.|Я нашёл ключи на кухне.
fly — flew — flown|flaɪ|летать|We flew to London in May.|Abbiamo volato a Londra a maggio.|Мы полетели в Лондон в мае.
forget — forgot — forgotten|fərˈɡɛt|забывать|She forgot my name.|Ha dimenticato il mio nome.|Она забыла моё имя.
forgive — forgave — forgiven|fərˈɡɪv|прощать|I forgave him long ago.|L'ho perdonato molto tempo fa.|Я простил его давно.
freeze — froze — frozen|friːz|замерзать, замораживать|The lake froze last winter.|Il lago è ghiacciato l'inverno scorso.|Озеро замёрзло прошлой зимой.
get — got — got/gotten|ɡɛt|получать|I got a new job in May.|Ho trovato un nuovo lavoro a maggio.|Я получил новую работу в мае.
give — gave — given|ɡɪv|давать|He gave me a book for my birthday.|Mi ha dato un libro per il mio compleanno.|Он подарил мне книгу на день рождения.
go — went — gone|ɡoʊ|идти, ехать|We went to the sea in summer.|Siamo andati al mare d'estate.|Мы поехали на море летом.
grow — grew — grown|ɡroʊ|расти|The plants grew very fast.|Le piante sono cresciute molto in fretta.|Растения выросли очень быстро.
hang — hung — hung|hæŋ|вешать|I hung the picture on the wall.|Ho appeso il quadro al muro.|Я повесил картину на стену.
have — had — had|hæv|иметь|They had a big garden.|Avevano un grande giardino.|У них был большой сад.
hear — heard — heard|hɪr|слышать|I heard a strange noise.|Ho sentito un rumore strano.|Я слышал странный шум.
hide — hid — hidden|haɪd|прятать|The cat hid under the bed.|Il gatto si è nascosto sotto il letto.|Кот спрятался под кроватью.
hit — hit — hit|hɪt|ударять|The ball hit the window.|La palla ha colpito la finestra.|Мяч попал в окно.
hold — held — held|hoʊld|держать|She held the baby in her arms.|Ha tenuto il bambino in braccio.|Она держала ребёнка на руках.
hurt — hurt — hurt|hɜːrt|ранить; причинять боль|I hurt my leg yesterday.|Mi sono fatto male alla gamba ieri.|Я ушиб ногу вчера.
keep — kept — kept|kiːp|держать, хранить|I kept all the old photos.|Ho conservato tutte le vecchie foto.|Я сохранил все старые фотографии.
know — knew — known|noʊ|знать|I knew the answer immediately.|Ho riconosciuto subito la risposta.|Я сразу узнал ответ.
lay — laid — laid|leɪ|класть|She laid the table for dinner.|Ha apparecchiato la tavola per cena.|Она накрыла стол на ужин.
lead — led — led|liːd|вести|The guide led us to the museum.|La guida ci ha portato al museo.|Гид провёл нас в музей.
learn — learnt/learned — learnt/learned|lɜːrn|учить, узнавать|I learnt many new words.|Ho imparato molte parole nuove.|Я выучил много новых слов.
leave — left — left|liːv|оставлять; уезжать|He left the office at six.|È uscito dall'ufficio alle sei.|Он покинул офис в шесть.
lend — lent — lent|lɛnd|одалживать|I lent my pen to Marco.|Ho prestato la penna a Marco.|Я одолжил ручку Марко.
let — let — let|lɛt|позволять|She let me use her phone.|Mi ha lasciato usare il suo telefono.|Она позволила мне пользоваться её телефоном.
lie — lay — lain|laɪ|лежать|The book lay on the table all day.|Il libro è rimasto sul tavolo tutto il giorno.|Книга пролежала на столе весь день.
light — lit/lighted — lit/lighted|laɪt|зажигать|He lit a candle in the dark.|Ha acceso una candela al buio.|Он зажёг свечу в темноте.
lose — lost — lost|luːz|терять|I lost my keys again.|Ho perso di nuovo le chiavi.|Я снова потерял ключи.
make — made — made|meɪk|делать, изготавливать|She made a cake for us.|Ha fatto una torta per noi.|Она сделала для нас торт.
mean — meant — meant|miːn|значить, иметь в виду|What did you mean?|Cosa volevi dire?|Что ты имел в виду?
meet — met — met|miːt|встречать, знакомиться|I met Marco at the station.|Ho incontrato Marco alla stazione.|Я встретил Марко на вокзале.
pay — paid — paid|peɪ|платить|I paid the bill at the restaurant.|Ho pagato il conto al ristorante.|Я оплатил счёт в ресторане.
put — put — put|pʊt|класть|I put the book on the shelf.|Ho messo il libro sullo scaffale.|Я поставил книгу на полку.
read — read — read|riːd|читать|I read two books last month.|Ho letto due libri il mese scorso.|Я прочитал две книги в прошлом месяце.
ride — rode — ridden|raɪd|ездить верхом; кататься|She rode her bike to school.|È andata a scuola in bicicletta.|Она поехала в школу на велосипеде.
ring — rang — rung|rɪŋ|звонить (о колоколе)|The phone rang all morning.|Il telefono ha suonato tutta la mattina.|Телефон звонил всё утро.
rise — rose — risen|raɪz|подниматься|The sun rose at six.|Il sole è sorto alle sei.|Солнце взошло в шесть.
run — ran — run|rʌn|бежать|I ran in the park this morning.|Ho corso nel parco stamattina.|Я бегал в парке сегодня утром.
say — said — said|sɛ|говорить|He said nothing about it.|Non ha detto niente a riguardo.|Он ничего об этом не сказал.
see — saw — seen|siː|видеть|I saw a good film yesterday.|Ieri ho visto un bel film.|Вчера я видел хороший фильм.
sell — sold — sold|sɛl|продавать|They sold their old car.|Hanno venduto la loro vecchia macchina.|Они продали свою старую машину.
send — sent — sent|sɛnd|отправлять|I sent you an email yesterday.|Ti ho inviato un'email ieri.|Я отправил тебе письмо вчера.
set — set — set|sɛt|ставить, устанавливать|She set the table for two.|Ha apparecchiato per due persone.|Она накрыла на двоих.
shake — shook — shaken|ʃeɪk|трясти|He shook my hand warmly.|Mi ha stretto la mano con calore.|Он горячо пожал мне руку.
shine — shone — shone|ʃaɪn|светить, сиять|The sun shone all day.|Il sole è brillato tutto il giorno.|Солнце светило весь день.
shoot — shot — shot|ʃuːt|стрелять; снимать (фото)|The photographer shot many photos.|Il fotografo ha scattato molte foto.|Фотограф сделал много снимков.
show — showed — shown|ʃoʊ|показывать|She showed me her new house.|Mi ha mostrato la sua nuova casa.|Она показала мне свой новый дом.
shut — shut — shut|ʃʌt|закрывать(ся)|He shut the door quietly.|Ha chiuso la porta piano.|Он тихо закрыл дверь.
sing — sang — sung|sɪŋ|петь|We sang all evening.|Abbiamo cantato tutta la sera.|Мы пели весь вечер.
sink — sank — sunk|sɪŋk|тонуть|The ship sank in the storm.|La nave è affondata nella tempesta.|Корабль затонул в шторм.
sit — sat — sat|sɪt|сидеть|I sat near the window.|Mi sono seduto vicino alla finestra.|Я сел у окна.
sleep — slept — slept|sliːp|спать|I slept only five hours last night.|Stanotte ho dormito solo cinque ore.|Сегодня ночью я спал всего пять часов.
speak — spoke — spoken|spiːk|говорить|She spoke to the teacher after class.|Ha parlato con l'insegnante dopo la lezione.|Она поговорила с учителем после урока.
spend — spent — spent|spɛnd|тратить|I spent fifty euros at the market.|Ho speso cinquanta euro al mercato.|Я потратил пятьдесят евро на рынке.
stand — stood — stood|stænd|стоять|We stood in front of the museum.|Siamo rimasti davanti al museo.|Мы стояли перед музеем.
steal — stole — stolen|stiːl|красть|Someone stole my bike.|Qualcuno ha rubato la mia bicicletta.|Кто-то украл мой велосипед.
swim — swam — swum|swɪm|плавать|I swam in the sea every day.|Ho nuotato nel mare ogni giorno.|Я плавал в море каждый день.
take — took — taken|teɪk|брать, взять|I took the bus to work.|Ho preso l'autobus per andare al lavoro.|Я поехал на работу на автобусе.
teach — taught — taught|tiːtʃ|учить, преподавать|He taught English for ten years.|Ha insegnato inglese per dieci anni.|Он преподавал английский десять лет.
tell — told — told|tɛl|рассказывать|She told me a funny story.|Mi ha raccontato una storia divertente.|Она рассказала мне смешную историю.
think — thought — thought|θɪŋk|думать|I thought about your idea.|Ho pensato alla tua idea.|Я подумал над твоей идеей.
throw — threw — thrown|θroʊ|бросать|He threw the ball to me.|Mi ha lanciato la palla.|Он бросил мне мяч.
understand — understood — understood|ˌʌndərˈstænd|понимать|I understood the lesson very well.|Ho capito molto bene la lezione.|Я очень хорошо понял урок.
wake — woke — woken|weɪk|просыпаться|I woke up at seven today.|Oggi mi sono svegliato alle sette.|Сегодня я проснулся в семь.
wear — wore — worn|wɛər|носить (одежду)|She wore a beautiful dress.|Ha indossato un bel vestito.|Она надела красивое платье.
win — won — won|wɪn|побеждать|Our team won the match.|La nostra squadra ha vinto la partita.|Наша команда выиграла матч.
write — wrote — written|raɪt|писать|I wrote a letter to my aunt.|Ho scritto una lettera a mia zia.|Я написал письмо тёте.
  `,
  },

];
})();

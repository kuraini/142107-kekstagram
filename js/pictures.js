'use strict';

var PHOTOS_AMOUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

function getRandomInRange(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomInArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

function makeRandomArray(arr) {
  var randomArray = [];
  var arrayLength = getRandomInRange(0, arr.length);
  var shuffledArray = shuffleArray(arr);

  for (var i = 0; i < arrayLength; i++) {
    randomArray[i] = shuffledArray[i];
  }

  return randomArray;
}


function makePicture(count) {
  var pictures = [];
  var photoNumber = 1;

  for (var i = 0; i < count; i++) {
    pictures[i] = {
      url: 'photos/' + photoNumber + '.jpg',
      likes: getRandomInRange(LIKES_MIN, LIKES_MAX),
      comments: makeRandomArray(COMMENTS),
      description: getRandomInArray(DESCRIPTIONS)
    };
    photoNumber++;
  }

  return pictures;
}

var pictures = makePicture(PHOTOS_AMOUNT);
console.log(pictures);

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

function renderPicture(picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
}

function makeFragment() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPicture(pictures[i]));
  }

  return fragment;
}

var picturesSection = document.querySelector('.pictures');
picturesSection.appendChild(makeFragment());

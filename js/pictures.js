'use strict';

var PHOTOS_COUNT = 25;
var PHOTO_CURRENT = 0;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var AVATAR_MIN = 1;
var AVATAR_MAX = 6;

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

var pictures = [];

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var picturesSection = document.querySelector('.pictures');
var pictureModal = document.querySelector('.big-picture');
var commentsList = pictureModal.querySelector('.social__comments');
var commentTemplate = commentsList.querySelector('.social__comment');

function getRandomInRange(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomInArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeComments(arr) {
  var comments = [];
  var commentsLength = getRandomInRange(0, arr.length);
  var commentFirst;
  var commentSecond;
  var unitedComment;

  for (var i = 0; i < commentsLength; i++) {
    commentFirst = getRandomInArray(arr);
    commentSecond = getRandomInArray(arr);
    unitedComment = commentFirst + ' ' + commentSecond;

    if (commentFirst === commentSecond) {
      unitedComment = commentFirst;
    }

    comments.push(unitedComment);
  }

  return comments;
}

function deleteChildren(elem) {
  var childrenLength = elem.childElementCount;

  for (var i = childrenLength - 1; i >= 0; i--) {
    elem.removeChild(elem.children[i]);
  }
}

function hideElement(elem) {
  elem.classList.add('visually-hidden');
}

function makePictures(count) {
  var pics = [];
  var photoNumber = 1;

  for (var i = 0; i < count; i++) {
    pics[i] = {
      url: 'photos/' + photoNumber + '.jpg',
      likes: getRandomInRange(LIKES_MIN, LIKES_MAX),
      comments: makeComments(COMMENTS),
      description: getRandomInArray(DESCRIPTIONS)
    };
    photoNumber++;
  }

  return pics;
}

function renderPicture(picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture__img').setAttribute('alt', picture.description);
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
}

function makeFragment(arr, func) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(func(arr[i]));
  }

  return fragment;
}

function renderComment(comment) {
  var commentElement = commentTemplate.cloneNode(true);

  commentElement.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + getRandomInRange(AVATAR_MIN, AVATAR_MAX) + '.svg');
  commentElement.querySelector('.social__text').textContent = comment;

  return commentElement;
}

function renderPictureModal(picture) {
  pictureModal.querySelector('.big-picture__img img').setAttribute('src', picture.url);
  pictureModal.querySelector('.big-picture__img img').setAttribute('alt', picture.description);
  pictureModal.querySelector('.likes-count').textContent = picture.likes;
  pictureModal.querySelector('.comments-count').textContent = picture.comments.length;
  pictureModal.querySelector('.social__caption').textContent = picture.description;
  hideElement(pictureModal.querySelector('.social__comment-count'));
  hideElement(pictureModal.querySelector('.comments-loader'));
  deleteChildren(commentsList);
  commentsList.appendChild(makeFragment(picture.comments, renderComment));
}

pictures = makePictures(PHOTOS_COUNT);
picturesSection.appendChild(makeFragment(pictures, renderPicture));
renderPictureModal(pictures[PHOTO_CURRENT]);
pictureModal.classList.remove('hidden');

'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var PHOTOS_AMOUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var AVATAR_MIN = 1;
var AVATAR_MAX = 6;
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;
var DEPTH_EFFECT_DEFAULT = 100;

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
var pictureClose = pictureModal.querySelector('#picture-cancel');
var uploadSection = picturesSection.querySelector('.img-upload');
var uploadFileInput = uploadSection.querySelector('#upload-file');
var uploadModal = picturesSection.querySelector('.img-upload__overlay');
var uploadClose = uploadModal.querySelector('#upload-cancel');

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

pictures = makePictures(PHOTOS_AMOUNT);
picturesSection.appendChild(makeFragment(pictures, renderPicture));

var picturesLinks = picturesSection.querySelectorAll('a.picture');

function onPictureModalEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePictureModal();
  }
}

function openPictureModal() {
  pictureModal.classList.remove('hidden');
  document.addEventListener('keydown', onPictureModalEscPress);
}

function closePictureModal() {
  pictureModal.classList.add('hidden');
  document.removeEventListener('keydown', onPictureModalEscPress);
}

picturesLinks.forEach(function (link, i) {
  link.addEventListener('click', function () {
    renderPictureModal(pictures[i]);
    openPictureModal();
  });
});

pictureClose.addEventListener('click', closePictureModal);
pictureClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePictureModal();
  }
});

function onUploadModalEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadModal();
  }
}

function openUploadModal() {
  uploadModal.classList.remove('hidden');
  document.addEventListener('keydown', onUploadModalEscPress);
}

function closeUploadModal() {
  uploadModal.classList.add('hidden');
  uploadFileInput.value = null;
  document.removeEventListener('keydown', onUploadModalEscPress);
}

uploadFileInput.addEventListener('change', openUploadModal);
uploadClose.addEventListener('click', closeUploadModal);
uploadClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeUploadModal();
  }
});

var uploadedPicture = uploadModal.querySelector('.img-upload__preview img');
var scaleFieldset = uploadModal.querySelector('.img-upload__scale');
var scaleControlSmaller = scaleFieldset.querySelector('.scale__control--smaller');
var scaleControlBigger = scaleFieldset.querySelector('.scale__control--bigger');
var scaleInput = scaleFieldset.querySelector('input[name="scale"]');
var effectLevelSlider = uploadModal.querySelector('.img-upload__effect-level');
var effectLevelPin = effectLevelSlider.querySelector('.effect-level__pin');
var effectLevelInput = uploadModal.querySelector('.effect-level__value');
var effectsList = uploadModal.querySelector('.effects__list');

var effectClass = null;

effectsList.addEventListener('click', function (evt) {
  var effect = evt.target.value;

  uploadedPicture.classList.remove(effectClass);
  effectClass = 'effects__preview--' + effect;
  uploadedPicture.classList.add(effectClass);
  uploadedPicture.style.filter = changeDepthOfEffect(DEPTH_EFFECT_DEFAULT, effect);
  effectLevelSlider.classList.remove('hidden');

  if (effect === 'none') {
    effectLevelSlider.classList.add('hidden');
  }
});

function calculateDepthOfEffect() {
  var barWidth = effectLevelPin.offsetParent.offsetWidth;
  effectLevelInput.value = effectLevelPin.offsetLeft;
  var currentDepth = 100 * effectLevelPin.offsetLeft / barWidth;

  return currentDepth;
}

function changeDepthOfEffect(depth, currentEffect) {
  var currentFilter;

  switch (currentEffect) {
    case 'chrome':
      currentFilter = 'grayscale(' + depth / 100 + ')';
      break;
    case 'sepia':
      currentFilter = 'sepia(' + depth / 100 + ')';
      break;
    case 'marvin':
      currentFilter = 'invert(' + depth / 100 + ')';
      break;
    case 'phobos':
      currentFilter = 'blur(' + (depth / 33.3).toFixed(2) + 'px)';
      break;
    case 'heat':
      currentFilter = 'brightness(' + (depth / 50 + 1) + ')';
      break;
    default:
      currentFilter = 'none';
      break;
  }
  return currentFilter;
}

function onPinMouseup() {
  changeDepthOfEffect(calculateDepthOfEffect(), uploadedPicture.classList[0].split('--')[1]);
}

effectLevelPin.addEventListener('mouseup', onPinMouseup);

var currentScale = SCALE_MAX;

function resizePreview(scaleValue) {
  scaleInput.setAttribute('value', scaleValue + '%');
  uploadedPicture.style.transform = 'scale(' + scaleValue / 100 + ')';
}

function reducePreview(step) {
  if (currentScale > SCALE_MIN) {
    currentScale -= step;
    resizePreview(currentScale);
  }
}

function increasePreview(step) {
  if (currentScale < SCALE_MAX) {
    currentScale += step;
    resizePreview(currentScale);
  }
}

scaleControlSmaller.addEventListener('click', function () {
  reducePreview(SCALE_STEP);
});

scaleControlBigger.addEventListener('click', function () {
  increasePreview(SCALE_STEP);
});

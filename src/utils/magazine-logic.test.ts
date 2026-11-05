/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateTokens,
  clampSlideIndex,
  calculateChecklistProgress,
  searchMagazineContent
} from './magazine-logic';

test('estimateTokens calculates cyrillic higher token density', () => {
  const russianSample = 'Искусственный интеллект и большие языковые модели';
  const englishSample = 'Artificial intelligence and large language models';

  const ruEst = estimateTokens(russianSample);
  const enEst = estimateTokens(englishSample);

  assert.equal(ruEst.isRussianDominant, true);
  assert.equal(enEst.isRussianDominant, false);
  assert.equal(ruEst.multiplierVsEnglish, 1.8);
  assert.ok(ruEst.estimatedTokens > 0);
  assert.ok(enEst.estimatedTokens > 0);
});

test('clampSlideIndex prevents out-of-bounds index navigation', () => {
  assert.equal(clampSlideIndex(-5, 50), 0);
  assert.equal(clampSlideIndex(25, 50), 25);
  assert.equal(clampSlideIndex(55, 50), 49);
  assert.equal(clampSlideIndex(0, 0), 0);
});

test('calculateChecklistProgress returns correct percentage', () => {
  assert.equal(calculateChecklistProgress([], 40), 0);
  assert.equal(calculateChecklistProgress(['d1', 'd2', 'd3', 'd4'], 40), 10);
  assert.equal(calculateChecklistProgress(new Array(40).fill('d'), 40), 100);
});

test('searchMagazineContent matches and extracts snippet', () => {
  const items = [
    {
      id: 's1',
      title: 'Что такое токен',
      category: 'Основы',
      slideIndex: 3,
      text: 'Токен это кусочек текста с которым работает модель. В русском языке токены расходуются быстрее.'
    },
    {
      id: 's2',
      title: 'Тарифы Claude',
      category: 'Деньги',
      slideIndex: 15,
      text: 'Claude Pro стоит 20 долларов в месяц и имеет скользящее окно на пять часов.'
    }
  ];

  const results = searchMagazineContent('токен', items);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 's1');
  assert.ok(results[0].snippet.includes('Токен'));

  const emptyResults = searchMagazineContent('nonexistent_word_xyz', items);
  assert.equal(emptyResults.length, 0);
});

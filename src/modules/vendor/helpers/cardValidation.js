import Joi from 'joi';
import { TRANSITION, TITLE_TEXT_MEDIA, TITLE_TEXT, TEXT_MEDIA, FLASHCARD, FILL_THE_GAPS } from '@data/constants';

const cardSchema = (card) => {
  switch (card.template) {
    case TRANSITION:
      return Joi.object().keys({
        title: Joi.string().required(),
      });
    case TITLE_TEXT_MEDIA:
      return Joi.object().keys({
        title: Joi.string().required(),
        text: Joi.string().required(),
        media: Joi.object().keys({
          publicId: Joi.string().required(),
          link: Joi.string().required(),
        }).required(),
      });
    case TITLE_TEXT:
      return Joi.object().keys({
        title: Joi.string().required(),
        text: Joi.string().required(),
      });
    case TEXT_MEDIA:
      return Joi.object().keys({
        text: Joi.string().required(),
        media: Joi.object().keys({
          publicId: Joi.string().required(),
          link: Joi.string().required(),
        }).required(),
      });
    case FLASHCARD:
      return Joi.object().keys({
        text: Joi.string().required(),
        backText: Joi.string().required(),
      });
    case FILL_THE_GAPS:
      return Joi.object().keys({
        text: Joi.string().required(),
        answers: Joi.array().items(Joi.string()).min(2).max(6),
        explanation: Joi.string().required(),
      });
    default:
      return Joi.object().keys();
  }
};

export const cardValidation = (card, options = {}) => cardSchema(card).validate(
  card,
  { ...options, allowUnknown: true }
);

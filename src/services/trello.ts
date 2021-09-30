import { MessageAttachment } from 'discord.js'
import { injectable } from 'inversify'
import { trelloUtil } from '../util'

const { downloadAttachment } = trelloUtil

const ACTION_STRINGS = {
  createCard: 'new card',
  updateCard: 'new action',
  updateCheckItemStateOnCard: 'checklist update',
  commentCard: 'new comment',
  addAttachmentToCard: 'new attachment',
  addChecklistToCard: 'new checklist',
  addLabelToCard: 'new label',
  removeLabelFromCard: 'label removed',
  deleteAttachmentFromCard: 'attachment removed'
}

@injectable()
export default class TrelloService {
  public async getActionPayload (action: any): Promise<any | undefined> {
    if (!(action.type in ACTION_STRINGS)) {
      return
    }

    const actionBody = await TrelloService.getActionBody(action)
    if (typeof actionBody === 'undefined') {
      return
    }

    const actionUrl = `https://trello.com/c/${action.data.card.shortLink}/${action.data.card.idShort}#action-${action.id}`
    const baseEmbed = {
      author: {
        name: action.memberCreator.username,
        icon_url: `${action.memberCreator.avatarUrl}/170.png`,
        url: `https://trello.com/${action.memberCreator.username}`
      },
      url: actionUrl,
      color: 31424
    }
    if (typeof actionBody.file !== 'undefined') {
      return {
        embeds: [{
          ...baseEmbed,
          ...actionBody.body,
        }],
        // @ts-expect-error
        files: [new MessageAttachment(...actionBody.file)]
      }
    } else {
      return {
        embeds: [{
          ...baseEmbed,
          ...actionBody
        }]
      }
    }
  }

  private static async getActionBody (action: any): Promise<any | undefined> {
    const boardSlug = `[${action.data.board.name}]`
    switch (action.type) {
      case 'createCard': {
        return {
          title: `${boardSlug} Card created: ${action.data.card.name}`
        }
      }

      case 'updateCard': {
        if (typeof action.data.old.closed !== 'undefined') {
          return {
            title: `${boardSlug} Card ${action.data.card.closed as boolean ? '' : 'un'}archived: ${action.data.card.name}`
          }
        } else if (typeof action.data.old.desc !== 'undefined') {
          return {
            title: `${boardSlug} Card description ${action.data.card.desc as string === '' ? 'deleted' : 'updated'}: ${action.data.card.name}`,
            description: action.data.card.desc !== '' ? action.data.card.desc : undefined
          }
        }
        return undefined
      }

      case 'addLabelToCard': {
        let labelName = action.data.label.name
        labelName = labelName !== '' ? labelName : action.data.label.color
        return {
          title: `${boardSlug} Label added to card: ${action.data.card.name}`,
          description: labelName.toUpperCase()
        }
      }

      case 'removeLabelFromCard': {
        let labelName = action.data.label.name
        labelName = labelName !== '' ? labelName : action.data.label.color
        return {
          title: `${boardSlug} Label removed from card: ${action.data.card.name}`,
          description: labelName.toUpperCase()
        }
      }

      case 'addAttachmentToCard': {
        return {
          body: {
            title: `${boardSlug} Attachment added to card: ${action.data.card.name}`,
            description: `[${action.data.attachment.name}](${action.data.attachment.url}):`,
            image: typeof action.data.attachment.previewUrl !== 'undefined'
              ? { url: `attachment://${action.data.attachment.name}` }
              : undefined
          },
          file: [await downloadAttachment(action.data.attachment.url), action.data.attachment.name]
        }
      }

      case 'deleteAttachmentFromCard': {
        return {
          title: `${boardSlug} Attachment deleted from card: ${action.data.card.name}`,
          description: `${action.data.attachment.name}`
        }
      }

      default: {
        return undefined
      }
    }
  }
}

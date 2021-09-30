import type {
  APIEmbed,
  RESTPostAPIWebhookWithTokenJSONBody
} from 'discord-api-types/v9'
import { injectable } from 'inversify'
import { trelloUtil } from '../util'

const { downloadAttachment } = trelloUtil

@injectable()
export default class TrelloService {
  public async getActionPayload (
    action: any
  ): Promise<RESTPostAPIWebhookWithTokenJSONBody & { files?: Record<string, Buffer> } | undefined> {
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

    if ('files' in actionBody) {
      return {
        embeds: [{
          ...baseEmbed,
          ...actionBody.embed
        }],
        files: actionBody.files
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

  private static async getActionBody (
    action: any
  ): Promise<APIEmbed | { embed: APIEmbed, files: Record<string, Buffer> } | undefined> {
    const card = action.data.card
    const cardSlug = `[${action.data.board.name}: ${card.name}]`
    switch (action.type) {
      case 'createCard': {
        return {
          title: `${cardSlug} Card created`
        }
      }

      case 'updateCard': {
        const oldCard = action.data.old
        if (typeof oldCard.closed !== 'undefined') {
          return {
            title: `${cardSlug} Card ${card.closed as boolean ? '' : 'un'}archived`
          }
        } else if (typeof oldCard.desc !== 'undefined') {
          return {
            title: `${cardSlug} Card description ${card.desc as string === '' ? 'deleted' : 'updated'}`,
            description: card.desc !== '' ? card.desc : undefined
          }
        } else if (typeof oldCard.name !== 'undefined') {
          return {
            title: `[${action.data.board.name}: ${oldCard.name}] Card renamed`,
            description: action.data.card.name
          }
        }
        return
      }

      case 'addLabelToCard': {
        const label = action.data.label
        return {
          title: `${cardSlug} Label added`,
          description: (label.name !== '' ? label.name : label.color).toUpperCase()
        }
      }

      case 'removeLabelFromCard': {
        let labelName = action.data.label.name
        labelName = labelName !== '' ? labelName : action.data.label.color
        return {
          title: `${cardSlug} Label removed`,
          description: labelName.toUpperCase()
        }
      }

      case 'addAttachmentToCard': {
        const attachment = action.data.attachment
        return {
          embed: {
            title: `${cardSlug} Attachment added`,
            description: `[${attachment.name}](${attachment.url}):`,
            image: typeof attachment.previewUrl !== 'undefined'
              ? { url: `attachment://${attachment.name}` }
              : undefined
          },
          files: { [attachment.name]: await downloadAttachment(attachment.url) }
        }
      }

      case 'deleteAttachmentFromCard': {
        return {
          title: `${cardSlug} Attachment deleted`,
          description: action.data.attachment.name
        }
      }

      case 'addChecklistToCard': {
        return {
          title: `${cardSlug} Checklist added`,
          description: action.data.checklist.name
        }
      }

      case 'updateChecklist': {
        if (typeof action.data.old.name !== 'undefined') {
          return {
            title: `${cardSlug} Checklist renamed`,
            description: action.data.checklist.name
          }
        }
        return
      }

      case 'removeChecklistFromCard': {
        return {
          title: `${cardSlug} Checklist removed`,
          description: action.data.checklist.name
        }
      }

      case 'updateCheckItemStateOnCard': {
        const checkItem = action.data.checkItem
        return {
          title: `${cardSlug} Check item marked as ${checkItem.state}`,
          description: `${action.data.checklist.name}: ${checkItem.name}`
        }
      }

      default: {
        return undefined
      }
    }
  }
}

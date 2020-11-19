'use strict'
const Trello = require('node-trello')

const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)

const ACTION_TYPES = {
  createCard: 'new card',
  updateCard: 'new action',
  updateCheckItemStateOnCard: 'checklist update',
  commentCard: 'new comment',
  addAttachmentToCard: 'new attachment',
  addChecklistToCard: 'new checklist',
  addLabelToCard: 'label added',
  removeLabelFromCard: 'label removed',
  deleteCard: 'card deleted'
}

class TrelloService {
  getMember (memberId, options) {
    return new Promise((resolve, reject) => {
      trello.get(`/1/members/${memberId}`, { fields: options }, (err, member) => {
        if (err) {
          reject(err)
        }
        resolve(member)
      })
    })
  }

  async getActionEmbed (action) {
    if (ACTION_TYPES[action.type]) {
      const member = await this.getMember(action.idMemberCreator, 'username,avatarUrl')
      const actionUrl = `https://trello.com/c/${action.data.card.shortLink}/${action.data.card.idShort}#action-${action.id}`

      return {
        title: `[${action.data.board.name}] 1 ${ACTION_TYPES[action.type]}`,
        description: `[\`${action.id}\`](${actionUrl}) ${action.data.card.name} - ${member.username}`,
        author: {
          name: member.username,
          icon_url: `${member.avatarUrl}/170.png`,
          url: `https://trello.com/${member.username}`
        },
        url: actionUrl,
        color: 31424
      }
    }
  }
}

module.exports = TrelloService

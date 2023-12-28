import { v4 as uuid } from 'uuid';
import { groupsService } from '../services/groups.service.js';
import { handleGetRandomColor } from '../helpers/businessHelpers.js';
import { groupColors } from '../utility/constans.js';

function handleGroupsEvent(socket) {
  socket.on(
    'create_group',
    async (name, creators, members, isPublic, userId) => {
      try {
        const newGroup = {
          id: uuid(),
          name,
          avatar: handleGetRandomColor(groupColors),
          creators,
          members,
          isPublic,
        };

        socket.emit('send_group', newGroup);

        await groupsService.createGroup(userId, newGroup);

        socket.emit('group_created', newGroup);
      } catch (error) {
        socket.emit('group_creation_failed', {
          message: 'Failed to create group! Please try again later!',
        });

        console.log(error);
      }
    }
  );

  socket.on('get_groups', async (arrayOfIds) => {
    try {
      const groups = await groupsService.getGroups(arrayOfIds);

      socket.emit('get_groups', groups);
    } catch (error) {
      socket.emit(
        'failed_get_groups',
        'Failed to get groups! Please try again later!'
      );
    }
  });

  socket.on('delete_group', async (groupId, userId, forEveryone) => {
    try {
      if (forEveryone) {
        await groupsService.deleteGroupForEveryone(userId, groupId);
      } else {
        await groupsService.deleteGroupForSelf(userId, groupId);
      }

      socket.emit('group_deleted', groupId);
    } catch (error) {
      socket.emit(
        'failed_delete_group',
        'Failed to delete group! Try again later!'
      );
    }
  });

  socket.on('update_group_members', async (groupId, userId) => {
    try {
      await groupsService.updateMembers(groupId, userId);
    } catch (error) {
      console.log(error);

      socket.emit('failed_update_members', 'Failed to update group members!');
    }
  });
}

export const groupsSocket = {
  handleGroupsEvent,
};

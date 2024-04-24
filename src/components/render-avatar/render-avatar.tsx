import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { Owner } from 'src/constants/user';
interface IProps {
  owner: Owner;
  sizeAvatar: number;
}
const RenderAvatar = ({ owner, sizeAvatar }: IProps) => {
  const firstLetterFirstName = owner.first_name.trim().charAt(0).toUpperCase();
  const firstLetterLastName = owner.last_name.trim().charAt(0).toUpperCase();

  return (
    <Tooltip title={owner.email}>
      {owner?.avatar ? (
        <Avatar size={sizeAvatar} src={owner.avatar} />
      ) : (
        <Avatar
          size={
            sizeAvatar
          }>{`${firstLetterFirstName}${firstLetterLastName} `}</Avatar>
      )}
    </Tooltip>
  );
};
export default RenderAvatar;

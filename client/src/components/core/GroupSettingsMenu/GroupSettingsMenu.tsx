import { MenuList } from "../../../../types/Menu";
import useDisclosureStore from "../../../store/useGroupDisclosureStore";
import {
  Trash,
  InfoCircle,
  Sliders,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import { Menu } from "../../shared/Menu";

const GroupSettingsMenu = () => {
  const { openDiscloSure: openDeleteGroupModal } =
    useDisclosureStore().deleteGroupItem;
  const { openDiscloSure: openGroupInfoModal } =
    useDisclosureStore().groupInfoItem;
  const { openDiscloSure: openManageGroupModal } =
    useDisclosureStore().manageGroupItem;

  const menuList: MenuList = [
    {
      name: "Main",
      items: [
        {
          name: "View group info",
          icon: <InfoCircle />,
          handleClick: openGroupInfoModal,
        },
        {
          name: "Manage group",
          icon: <Sliders />,
          handleClick: openManageGroupModal,
        },
      ],
    },
    {
      name: "Additional",
      items: [
        {
          name: "Delete and leave",
          icon: <Trash />,
          color: "red",
          handleClick: openDeleteGroupModal,
        },
      ],
    },
  ];

  return (
    <Menu menuList={menuList}>
      <ThreeDotsVertical className="h-5 w-5 cursor-pointer" />
    </Menu>
  );
};

export default GroupSettingsMenu;

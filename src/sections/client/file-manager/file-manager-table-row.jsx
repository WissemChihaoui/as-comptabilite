import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { useRouter } from 'src/routes/hooks';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';

import { FileManagerShareDialog } from './file-manager-share-dialog';
import { FileManagerFileDetails } from './file-manager-file-details';

// ----------------------------------------------------------------------

export function FileManagerTableRow({ row }) {
  const theme = useTheme();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(row.isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleCopy = useCallback(() => {
    toast.success('Copied!');
    copy(row.url);
  }, [copy, row.url]);

  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  const visit = useRouter();

  return (
    <>
      <TableRow
        onClick={() => visit.push(paths.dashboard.declarationImpotDrop(row.id))}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
          },
          [`& .${tableCellClasses.root}`]: { ...defaultStyles },
          ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
        }}
      >
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={row.type} />
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {row.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="caption">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit amet sequi delectus
            dolores animi rem maxime perferendis, repellat, ut quia nam obcaecati suscipit optio
            consequuntur sapiente, in dolorem ipsam iusto.
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
}

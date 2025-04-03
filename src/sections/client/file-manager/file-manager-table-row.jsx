import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import { varAlpha } from 'src/theme/styles';

import { FileThumbnail } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

export function FileManagerTableRow({ row }) {
  const theme = useTheme();

  const details = useBoolean();

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });


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
  );
}

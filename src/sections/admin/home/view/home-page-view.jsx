import React from 'react';
import { useTheme } from '@emotion/react';

import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/admin/main';
import { SeoIllustration } from 'src/assets/illustrations';
import { useGetForms, useGetStatistics } from 'src/actions/forms';

import { svgColorClasses } from 'src/components/svg-color';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppWidgetSummary } from '../app-widget-summary';
import { CourseWidgetSummary } from '../course-widget-summary';

export default function HomePageView() {
  const theme = useTheme();
  const { forms, formsLoading } = useGetForms();
  const {
    totalUsers,
    totalForms,
    totalDocuments,
    usersMonthly = [],
    formsMonthly = [],
    documentsMonthly = [],
    loading: statsLoading,
  } = useGetStatistics();

  const loading = formsLoading || statsLoading;

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a skeleton or spinner
  }

  const getLast8MonthsLabels = () => {
    const now = new Date();
    const monthLabels = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i);
      monthLabels.push(date.toLocaleString('default', { month: 'short' }));
    }

    return monthLabels;
  };

  const calculatePercent = (monthlyData) => {
    if (monthlyData.length < 2) return 0;
    const lastMonth = monthlyData[monthlyData.length - 1];
    const prevMonth = monthlyData[monthlyData.length - 2];
    if (prevMonth === 0) return lastMonth > 0 ? 100 : 0;
    return +(((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1);
  };

  const categories = getLast8MonthsLabels();

  const percentUsers = calculatePercent(usersMonthly);
  const percentForms = calculatePercent(formsMonthly);
  const percentDocuments = calculatePercent(documentsMonthly);

  console.log(forms);

  const totalFormsCount = forms.length;

  const getPercent = (count) => {
    if (totalFormsCount === 0) return 0;
    return ((count / totalFormsCount) * 100).toFixed(1);
  };

  const countByService = (id) => forms.filter((form) => form.service.id === id).length;
  return (
    <DashboardContent>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <AppWelcome
            title="Bonjour 👋"
            description="Consultez les listes de demandes, Les utilisateurs attendent votre action"
            img={<SeoIllustration hideBackground />}
            action={
              <Button
                variant="contained"
                color="primary"
                href={paths.admin.demandes}
                LinkComponent={RouterLink}
              >
                Voir les demandes
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Totale des utilisateurs"
            percent={percentUsers}
            total={totalUsers}
            chart={{
              categories,
              series: usersMonthly,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Totale des demandes"
            percent={percentForms}
            total={totalForms}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories,
              series: formsMonthly,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Totale des documents"
            percent={percentDocuments}
            total={totalDocuments}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories,
              series: documentsMonthly,
            }}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <AppWidget
            title="Demande Autorisation"
            total={countByService(1)}
            icon="solar:user-rounded-bold"
            chart={{
              series: getPercent(countByService(1)),
              colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
            }}
            sx={{
              bgcolor: 'info.dark',
              [`& .${svgColorClasses.root}`]: { color: 'info.light' },
            }}
          />
        </Grid>

        <Grid xs={6} md={3}>
          <AppWidget
            title="SARL"
            total={countByService(2)}
            icon="solar:user-rounded-bold"
            chart={{
              series: getPercent(countByService(2)),
              colors: [theme.vars.palette.success.light, theme.vars.palette.success.main],
            }}
            sx={{
              bgcolor: 'success.dark',
              [`& .${svgColorClasses.root}`]: { color: 'success.light' },
            }}
          />
        </Grid>

        <Grid xs={6} md={3}>
          <AppWidget
            title="SARL-S"
            total={countByService(3)}
            icon="solar:user-rounded-bold"
            chart={{
              series: getPercent(countByService(3)),
              colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
            }}
            sx={{
              bgcolor: 'warning.dark',
              [`& .${svgColorClasses.root}`]: { color: 'warning.light' },
            }}
          />
        </Grid>

        <Grid xs={6} md={3}>
          <AppWidget
            title="Déclaration Impôt"
            total={countByService(4)}
            icon="solar:user-rounded-bold"
            chart={{
              series: getPercent(countByService(4)),
            }}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <CourseWidgetSummary
            title="Demandes en attente"
            total={forms.filter((form) => form.status === 'review').length}
            icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <CourseWidgetSummary
            title="Demandes acceptés"
            total={forms.filter((form) => form.status === 'accepted').length}
            color="success"
            icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <CourseWidgetSummary
            title="Demandes refusés"
            total={forms.filter((form) => form.status === 'rejected').length}
            color="error"
            icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-certificates.svg`}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <CourseWidgetSummary
            title="Demandes en cours"
            total={forms.filter((form) => form.status === 'pending').length}
            color="info"
            icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-certificates.svg`}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

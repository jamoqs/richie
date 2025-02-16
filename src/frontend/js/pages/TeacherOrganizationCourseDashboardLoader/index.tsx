import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Spinner } from 'components/Spinner';
import { DashboardLayout } from 'widgets/Dashboard/components/DashboardLayout';
import { TeacherOrganizationDashboardSidebar } from 'widgets/Dashboard/components/TeacherOrganizationDashboardSidebar';
import { useOrganization } from 'hooks/useOrganizations';
import TeacherDashboardCourseList from 'components/TeacherDashboardCourseList';
import { useBreadcrumbsPlaceholders } from 'hooks/useBreadcrumbsPlaceholders';

const messages = defineMessages({
  title: {
    defaultMessage: 'Courses of {organizationTitle}',
    description: 'Message displayed as title of organization courses page',
    id: 'components.TeacherOrganizationCourseDashboardLoader.title',
  },
  loading: {
    defaultMessage: 'Loading organization ...',
    description: 'Message displayed while loading an organization',
    id: 'components.TeacherOrganizationCourseDashboardLoader.loading',
  },
});

export const TeacherOrganizationCourseDashboardLoader = () => {
  const intl = useIntl();
  const { organizationId } = useParams<{ organizationId: string }>();
  const {
    item: organization,
    states: { fetching },
  } = useOrganization(organizationId);
  useBreadcrumbsPlaceholders({
    organizationTitle: organization.title ?? '',
  });
  return (
    <DashboardLayout sidebar={<TeacherOrganizationDashboardSidebar />}>
      {fetching && (
        <Spinner aria-labelledby="loading-courses-data">
          <span id="loading-courses-data">
            <FormattedMessage {...messages.loading} />
          </span>
        </Spinner>
      )}
      {!fetching && (
        <TeacherDashboardCourseList
          titleTranslated={intl.formatMessage(messages.title, {
            organizationTitle: organization.title,
          })}
          organizationId={organization.id}
        />
      )}
    </DashboardLayout>
  );
};

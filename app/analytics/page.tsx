import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { Container } from '@chakra-ui/react';

export default function AnalyticsPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <AnalyticsDashboard />
    </Container>
  );
}

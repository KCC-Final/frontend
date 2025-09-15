import Bedge from '@/components/my-library/bedge';
import MyBookshelf from '@/components/my-library/bookshelf';
import ChartByField from '@/components/my-library/chart-by-field';
import ChartByPeriod from '@/components/my-library/chart-by-period';
import MyInfo from '@/components/my-library/my-info';
import Report from '@/components/my-library/report';

function MyLibraryPage() {
  return (
    <>
      <MyInfo />
      <Bedge />
      <ChartByPeriod />
      <ChartByField />
      <MyBookshelf />
      <Report />
    </>
  );
}

export default MyLibraryPage;

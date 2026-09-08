import ProgressLoader from '@/components/Loaders/ProgressLoader';
import { Outlet, useNavigation } from 'react-router';

const RootLayout = () => {
  const navigation = useNavigation();

  const isNavigating = navigation.state === 'loading';

  return (
    <>
      <ProgressLoader isLoading={isNavigating} />
      <Outlet />
    </>
  )
}

export default RootLayout
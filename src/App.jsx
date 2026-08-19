import {Routes, Route} from 'react-router-dom';
import {ThemeProvider, useTheme} from './context/ThemeContext';
import {TransactionsProvider} from './context/TransactionsContext';
import AppNavbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GradientWaves from './components/Gradient';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionDetail from './pages/TransactionDetail';
import Summary from './pages/Summary';

function AppBackground() {
    const {theme} = useTheme();

    const colors =  theme === 'dark'
        ? {horizonColor: '#1a1a1a', waveColor: '#8f2557', crestColor: '#e2668f'}
        : {horizonColor: '#ffffff', waveColor: '#f9adc8', crestColor: '#e2668f'};

        return (
            <GradientWaves
                horizonColor={colors.horizonColor}
                waveColor={colors.waveColor}
                crestColor={colors.crestColor}
                speed={1}/>
        );
}

export default function App() {
    return (
        <ThemeProvider>
            <TransactionsProvider>
                <AppBackground />
                <AppNavbar />
                <div className="app-body">
                    <Sidebar />
                        <main className="container">
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/add" element={<AddTransaction/>}/>
                            <Route path="/transaction/:id" element={<TransactionDetail/>}/>
                            <Route path="/summary" element={<Summary/>}/>
                            <Route path="*" element={<Dashboard/>}/>
                        </Routes>
                    </main>
                </div>
            </TransactionsProvider>
        </ThemeProvider>
    );
}
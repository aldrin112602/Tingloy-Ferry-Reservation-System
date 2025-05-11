import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ViewPassengersProps } from '@/types';


const ViewPassengers = ({ isOpenDialog, setISOpenDialog, passengersArr }: ViewPassengersProps) => {
    return (
        <Dialog open={isOpenDialog} onOpenChange={setISOpenDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Passenger Information</DialogTitle>
                </DialogHeader>
                {passengersArr.length > 0 ? (
                    <ul className="my-4 divide-y divide-gray-100">
                        {passengersArr.map((passenger, index) => (
                            <li key={index} className="flex justify-between py-2">
                                <span>{passenger.full_name}</span>
                                {passenger.is_main_passenger && <Badge className="bg-blue-100 text-blue-800">Main Passenger</Badge>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-muted-foreground my-4 text-center text-sm">No passengers have been added for this booking.</div>
                )}
                <Button onClick={() => setISOpenDialog(false)}>Close</Button>
            </DialogContent>
        </Dialog>
    );
};

export default ViewPassengers;

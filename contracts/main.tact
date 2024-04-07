import "@stdlib/ownable";
import "@stdlib/deploy";
import "./imports/trustable.tact";

contract Main with Deployable, OwnableTransferable, Trustable {
    owner: Address;
    trustedAddresses: map<Address, Bool>;

    init() {
        self.owner = sender();
    }

}

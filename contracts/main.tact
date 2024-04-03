import "@stdlib/ownable";
import "@stdlib/deploy";

message AddTrustedAddress {
    addr: Address;
}

message RemoveTrustedAddress {
    addr: Address;
}

contract Main with Deployable, Ownable {
    owner: Address;
    trustedAddresses: map<Address, Bool>;

    init() {
        self.owner = sender();
    }

    receive(msg: ChangeOwner) {
        self.requireOwner();
        self.owner = msg.newOwner;
        self.reply(ChangeOwnerOk{ queryId: msg.queryId, newOwner:msg.newOwner }.toCell());
    }

    receive(msg: AddTrustedAddress) {
        self.requireOwner();
        self.trustedAddresses.set(msg.addr, true);
    }

    receive(msg: RemoveTrustedAddress) {
        self.requireOwner();
        self.trustedAddresses.set(msg.addr, null);
    }

    get fun get_trusted_addresses(): map<Address, Bool> {
        return self.trustedAddresses;
    }
}

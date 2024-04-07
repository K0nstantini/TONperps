import "@stdlib/ownable";

message AddTrustedAddress {
    addr: Address;
}

message RemoveTrustedAddress {
    addr: Address;
}

trait Trustable with Ownable {
    owner: Address;
    trustedAddresses: map<Address, Bool>;

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

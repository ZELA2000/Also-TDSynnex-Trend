import * as accountController from '../../controllers/account.controller';
import AlsoApiClient from '../../client/AlsoApiClient';

jest.mock('../../client/AlsoApiClient');

describe('Account Controller', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;
    let mockApiClient: jest.Mocked<AlsoApiClient>;

    beforeEach(() => {
        mockRequest = {
            body: {},
            params: {},
            sessionToken: 'test-token',
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();

        mockApiClient = new AlsoApiClient() as jest.Mocked<AlsoApiClient>;
        (AlsoApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    });

    describe('createCompany', () => {
        it('should create a company successfully', async () => {
            const mockCompany = {
                AccountId: 12345,
                Name: 'Test Company',
                Email: 'test@example.com',
            };

            mockRequest.body = {
                Company: {
                    Name: 'Test Company',
                    Email: 'test@example.com',
                },
            };

            mockApiClient.setSessionToken = jest.fn();
            mockApiClient.createCompany = jest.fn().mockResolvedValue(mockCompany);

            await accountController.createCompany(mockRequest, mockResponse, mockNext);

            expect(mockApiClient.setSessionToken).toHaveBeenCalledWith('test-token');
            expect(mockApiClient.createCompany).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockCompany,
                message: 'Company created successfully',
            });
        });

        it('should return 400 if company data is missing', async () => {
            mockRequest.body = {};

            await accountController.createCompany(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Company data is required',
            });
        });
    });

    describe('updateCompany', () => {
        it('should update a company successfully', async () => {
            mockRequest.params.id = '12345';
            mockRequest.body = {
                Company: {
                    Address: 'New Address',
                },
            };

            mockApiClient.setSessionToken = jest.fn();
            mockApiClient.updateCompany = jest.fn().mockResolvedValue(undefined);

            await accountController.updateCompany(mockRequest, mockResponse, mockNext);

            expect(mockApiClient.updateCompany).toHaveBeenCalledWith({
                Company: {
                    AccountId: 12345,
                    Address: 'New Address',
                },
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Company updated successfully',
            });
        });
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const mockUser = {
                AccountId: 67890,
                Email: 'user@example.com',
                FirstName: 'John',
                LastName: 'Doe',
                Role: 'User',
            };

            mockRequest.body = {
                User: {
                    Email: 'user@example.com',
                    FirstName: 'John',
                    LastName: 'Doe',
                    Role: 'User',
                    ParentAccountId: 12345,
                },
            };

            mockApiClient.setSessionToken = jest.fn();
            mockApiClient.createUser = jest.fn().mockResolvedValue(mockUser);

            await accountController.createUser(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser,
                message: 'User created successfully',
            });
        });
    });

    describe('getUsers', () => {
        it('should get users for a company', async () => {
            const mockUsers = {
                Users: [
                    { AccountId: 1, Email: 'user1@example.com', FirstName: 'User', LastName: 'One', Role: 'User' },
                    { AccountId: 2, Email: 'user2@example.com', FirstName: 'User', LastName: 'Two', Role: 'Admin' },
                ],
            };

            mockRequest.params.accountId = '12345';

            mockApiClient.setSessionToken = jest.fn();
            mockApiClient.getUsers = jest.fn().mockResolvedValue(mockUsers);

            await accountController.getUsers(mockRequest, mockResponse, mockNext);

            expect(mockApiClient.getUsers).toHaveBeenCalledWith({ AccountId: 12345 });
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockUsers,
            });
        });

        it('should return 400 for invalid account ID', async () => {
            mockRequest.params.accountId = 'invalid';

            await accountController.getUsers(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid account ID',
            });
        });
    });
});
